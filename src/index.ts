import './polyfill';


export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;

export type TypedPipe<Input> = TypedStream<Input> & {
    Then<Output>(mapper: TypedMapper<Input, Output>): TypedPipe<Output>
};

const ok = (ok: any, error: string) => {
    if (!ok) {
        throw new Error(error)
    }
}

type TypedIterator<Type> = AsyncIterator<Type>;

function streamToIterator<Type>(stream: TypedStream<Type>): TypedIterator<Type> {
    return stream[Symbol.asyncIterator]();
}

function iteratorFactoryToStream<Type>(iteratorFactory: () => TypedIterator<Type>): TypedStream<Type> {
    return {
        [Symbol.asyncIterator]: iteratorFactory,
    };
}

export function Pipe<Input>(stream: TypedStream<Input>): TypedPipe<Input> {
    ok(stream[Symbol.asyncIterator], 'No async iterator in stream')

    return {
        [Symbol.asyncIterator]: () => streamToIterator(stream),
        Then: <Output>(mapper: TypedMapper<Input, Output>) => {
            return Pipe(iteratorFactoryToStream(() => streamToIterator(mapper(stream))))
        },
    }
}

async function* foo(): TypedStream<number> {
    yield await 1;
    yield await 2;
}


async function run<T extends any>(stream: TypedStream<T>): Promise<T | undefined> {
    let value: T | undefined = undefined;
    for await (const record of stream) {
        value = record
    }
    return value
}

type MaybeAsync<Type> = Type | Promise<Type>;

function map<Input, Output>(mapper: (input: Input) => MaybeAsync<Output>): TypedMapper<Input, Output> {
    return (inputStream) => {
        async function* mappedStream(): TypedStream<Output> {
            for await (const record of inputStream) {
                yield await mapper(record)
            }
        }

        return mappedStream();
    };
}

function tap<Input>(tapper: (input: Input) => MaybeAsync<any>) {
    return map<Input, Input>(async (input) => {
        await tapper(input)
        return input
    })
}


function filter<Input>(condition: (input: Input) => MaybeAsync<boolean | undefined | null>): TypedMapper<Input, Input> {
    return (input) => {
        async function* filtered(): TypedStream<Input> {
            for await (const record of input) {
                const ok = await condition(record);
                if (ok) {
                    yield record
                }
            }
        }

        return filtered();
    };
}

async function app() {
    const x = Pipe(foo())
        .Then(tap(console.log))
        .Then(filter((x) => x > 1))
        .Then(map((a): { name: string } => ({name: String(a)})))
        .Then(map((x) => ({...x, ok: true})))
        .Then(tap(console.log));

    await run(x)
}

app().catch(console.error)