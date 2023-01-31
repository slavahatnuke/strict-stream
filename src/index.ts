// types
export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedStreamOf<Input> = TypedStream<Input> & {
    pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output>
};
export type TypedStreamLike<Type> = AsyncIterable<Type> | Iterable<Type> | Type[];
export type TypedStreamMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;
export type TypedMaybeAsync<Type> = Type | Promise<Type>;

// of
export function of<Input>(inputStream: TypedStream<Input>) {
    return {
        [Symbol.asyncIterator]: () => inputStream[Symbol.asyncIterator](),
        pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output> {
            return of(mapper(inputStream))
        }
    }
}

// run | pull
export async function run<T extends any>(stream: TypedStream<T>): Promise<T | undefined> {
    let value: T | undefined = undefined;
    for await (const record of stream) {
        value = record
    }
    return value
}

export const pull = run

