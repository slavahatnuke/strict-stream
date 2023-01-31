// types

export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedStreamOf<Input> = TypedStream<Input> & {
    pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output>
};
export type TypedStreamLike<Type> = AsyncIterable<Type> | Iterable<Type> | Type[];
export type TypedStreamMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;
export type TypedMaybeAsync<Type> = Type | Promise<Type>;

// of
export function of<Input>(inputStream: TypedStream<Input>): TypedStreamOf<Input> {
    return {
        [Symbol.asyncIterator]: () => inputStream[Symbol.asyncIterator](),
        pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output> {
            return of(mapper(inputStream))
        }
    }
}

// type IPipe<CurrentInput, CurrentOutput> = TypedStreamMapper<CurrentInput, CurrentOutput> & {
//     pipe<NextOutput>(mapper: TypedStreamMapper<CurrentOutput, NextOutput>): IPipe<CurrentOutput, NextOutput>
// }
//
// export function pipe<In, Out>(mapper: TypedStreamMapper<In, Out>): IPipe<In, Out> {
//     const streamMapper: IPipe<In, Out> = ((input: TypedStream<In>) => mapper(input)) as IPipe<In, Out>;
//     // @ts-ignore
//     streamMapper.pipe = <Output>(mapper: TypedStreamMapper<Out, Output>) => mapper
//
//     return streamMapper;
// }

// run | pull
export async function run<Type extends any, Default extends any = undefined>(stream: TypedStream<Type>, defaultValue = undefined as Default): Promise<Type | Default> {
    let value: Type | Default = defaultValue;
    for await (const record of stream) {
        value = record
    }
    return value
}

export const pull = run

