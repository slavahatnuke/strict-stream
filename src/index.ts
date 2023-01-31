// types

export type TypedStream<Type> = AsyncIterable<Type>;
export type TypedStreamOf<Input> = TypedStream<Input> & {
    pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output>
};
export type TypedStreamLike<Type> = AsyncIterable<Type> | Iterable<Type> | Type[];
export type TypedStreamMapper<Input, Output> = (stream: TypedStream<Input>) => TypedStream<Output>;
export type TypedMaybeAsync<Type> = Type | Promise<Type>;

export type TypedStreamPiper<In, Out> = TypedStreamMapper<In, Out> & {
    pipe<Output>(mapper: TypedStreamMapper<Out, Output>): TypedStreamPiper<In, Output>
}

// of
export function of<Input>(inputStream: TypedStream<Input>): TypedStreamOf<Input> {
    return {
        [Symbol.asyncIterator]: () => inputStream[Symbol.asyncIterator](),
        pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output> {
            return of(mapper(inputStream))
        }
    }
}


export function pipe<In, Out>(mapper: TypedStreamMapper<In, Out>): TypedStreamPiper<In, Out> {
    const streamMapper: TypedStreamMapper<In, Out> = (input: TypedStream<In>) => mapper(input)
    // @ts-ignore
    streamMapper.pipe = <Output>(mapper: TypedStreamMapper<Out, Output>) => {
        return pipe<In, Output>((input: TypedStream<In>) => {
            const nextStream = streamMapper(input);
            return mapper(nextStream)
        })
    }
    // @ts-ignore
    return streamMapper;
}

// run | pull
export async function run<Type extends any, Default extends any = undefined>(stream: TypedStream<Type>, defaultValue = undefined as Default): Promise<Type | Default> {
    let value: Type | Default = defaultValue;
    for await (const record of stream) {
        value = record
    }
    return value
}

export const pull = run

