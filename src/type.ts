export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedStreamLike<Type> = TypedStream<Type> | Iterable<Type> | Type[];
export type TypedStreamMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;
export type TypedMaybeAsync<Type> = Type | Promise<Type>;
export type TypedStreamOf<Input> = TypedStream<Input> & {
    pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output>
};