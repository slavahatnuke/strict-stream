// types

export type StrictStream<Type> = AsyncIterable<Type>;
export type StrictStreamOf<Input> = StrictStream<Input> & {
    pipe<Output>(mapper: StrictStreamMapper<Input, Output>): StrictStreamOf<Output>
};
export type StrictStreamLike<Type> = AsyncIterable<Type> | Iterable<Type> | Type[];
export type StrictStreamMapper<Input, Output> = (stream: StrictStream<Input>) => StrictStream<Output>;
export type StrictStreamPromised<Type> = Type | Promise<Type>;

export type StrictStreamPipeBuilder<In, Out> = StrictStreamMapper<In, Out> & {
    pipe<Output>(mapper: StrictStreamMapper<Out, Output>): StrictStreamPipeBuilder<In, Output>
}

// of
export function of<Input>(inputStream: StrictStream<Input>): StrictStreamOf<Input> {
    return {
        [Symbol.asyncIterator]: () => inputStream[Symbol.asyncIterator](),
        pipe<Output>(mapper: StrictStreamMapper<Input, Output>): StrictStreamOf<Output> {
            return of(mapper(inputStream))
        }
    }
}


export function pipe<In, Out>(mapper: StrictStreamMapper<In, Out>): StrictStreamPipeBuilder<In, Out> {
    const streamMapper: StrictStreamMapper<In, Out> = (input: StrictStream<In>) => mapper(input)
    // @ts-ignore
    streamMapper.pipe = <Output>(mapper: StrictStreamMapper<Out, Output>) => {
        return pipe<In, Output>((input: StrictStream<In>) => {
            const nextStream = streamMapper(input);
            return mapper(nextStream)
        })
    }
    return streamMapper as StrictStreamPipeBuilder<In, Out>;
}

export async function run<Type extends any, Default extends any = undefined>(stream: StrictStream<Type>, defaultValue = undefined as Default): Promise<Type | Default> {
    let value: Type | Default = defaultValue;
    for await (const record of stream) {
        value = record
    }
    return value
}