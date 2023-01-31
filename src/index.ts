import './polyfill';


export type ITypedStream<Type> = AsyncIterable<Type>;
export type ITypedMapper<Input, Output> = (stream: ITypedStream<Input>) => ITypedStream<Output>;

export type ITypedIterator<Type> = AsyncIterator<Type>;

export type TypedStreamOf<Input> = ITypedStream<Input> & {
    Then<Output>(mapper: ITypedMapper<Input, Output>): TypedStreamOf<Output>
};

const ok = (ok: any, error: string) => {
    if (!ok) {
        throw new Error(error)
    }
}

function streamToIterator<Type>(stream: ITypedStream<Type>): ITypedIterator<Type> {
    return stream[Symbol.asyncIterator]();
}

function iteratorFactoryToStream<Type>(iteratorFactory: () => ITypedIterator<Type>): ITypedStream<Type> {
    return {
        [Symbol.asyncIterator]: iteratorFactory,
    };
}

export function Pipe<Input>(stream: ITypedStream<Input>): TypedStreamOf<Input> {
    ok(stream[Symbol.asyncIterator], 'No async iterator in stream')

    return {
        [Symbol.asyncIterator]: () => streamToIterator(stream),
        Then<Output>(mapper: ITypedMapper<Input, Output>): TypedStreamOf<Output> {
            return Pipe(iteratorFactoryToStream(() => streamToIterator(mapper(stream))))
        }
    }
}


async function run<T extends any>(stream: ITypedStream<T>): Promise<T | undefined> {
    let value: T | undefined = undefined;
    for await (const record of stream) {
        value = record
    }
    return value
}

export type MaybeAsyncType<Type> = Type | Promise<Type>;

export type ITransformTypedStream<Input, Output> = (input: ITypedStream<Input>) => () => ITypedStream<Output>

function transformStream<Input, Output>(transformer: ITransformTypedStream<Input, Output>): ITypedMapper<Input, Output> {
    return (input: ITypedStream<Input>) => transformer(input)()
}

function map<Input, Output>(mapper: (input: Input) => MaybeAsyncType<Output>): ITypedMapper<Input, Output> {
    return transformStream((inputStream) => async function* mappedStream(): ITypedStream<Output> {
        for await (const record of inputStream) {
            yield await mapper(record)
        }
    });
}

function tap<Input>(fn: (input: Input) => MaybeAsyncType<any>): ITypedMapper<Input, Input> {
    return map<Input, Input>(async (input): Promise<Input> => {
        await fn(input)
        return input
    })
}


function filter<Input>(condition: (input: Input) => MaybeAsyncType<boolean | undefined | null>): ITypedMapper<Input, Input> {
    return transformStream((inputStream) => async function* filtered(): ITypedStream<Input> {
        for await (const record of inputStream) {
            if (await condition(record)) {
                yield record
            }
        }
    });
}

async function* sequence(size: number): ITypedStream<number> {
    for (let i = 0; i < size; i++) {
        yield i;
    }
}

async function app() {
    let idx = 0;
    const x = Pipe(sequence(3))
        .Then(map((x) => x + 10))
        .Then(tap((x) => console.log(x)))
        .Then(filter((x) => x > 1))
        .Then(map((a): { name: string } => ({name: String(a)})))
        .Then(map((x) => ({...x, ok: true})))
        .Then(tap((x) => {
            console.log(x)
            idx++;
            if (idx % 100000 === 0) {
                console.log(x)
            }
        }));

    await run(x)
}

app().catch(console.error)