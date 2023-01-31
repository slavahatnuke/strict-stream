import './polyfill';


export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;

export type TypedPipe<Input> = TypedStream<Input> & {
    and<Output>(mapper: TypedMapper<Input, Output>): TypedPipe<Output>
};

export function pipe<Input>(stream: TypedStream<Input>): TypedPipe<Input> {
    return {
        ...stream,
        and<Output>(mapper: TypedMapper<Input, Output>) {
            return pipe(mapper(stream))
        }
    }
}

async function* foo(): TypedStream<string> {
    yield await '1';
    yield await '2';
}

pipe(foo())
    .and((stream) => stream)

async function run<T extends any>(stream: TypedStream<T>) {
    for await (const record of stream) {
    }
}

async function app() {
    await run(foo())
}

app().catch(console.error)