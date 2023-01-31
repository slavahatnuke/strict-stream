import './polyfill';
import {TypedStream, TypedStreamLike, TypedStreamMapper, TypedStreamOf} from "./type";


export function toTypedStream<Input>(stream: TypedStreamLike<Input>): TypedStream<Input> {
    if (!((Symbol.asyncIterator in stream) || (Symbol.iterator in stream))) {
        throw new Error('No iterator in stream')
    }

    if (Symbol.asyncIterator in stream) {
        return stream
    } else if (Symbol.iterator in stream) {
        return {
            [Symbol.asyncIterator]: () => {
                const syncIterator = stream[Symbol.iterator]();
                return {
                    next: async () => syncIterator.next()
                }
            },
        }
    } else {
        throw new Error(`Impossible to make a stream, got ${typeof stream}`)
    }
}

export function Of<Input>(inputStream: TypedStream<Input>) {
    return {
        [Symbol.asyncIterator]: () => inputStream[Symbol.asyncIterator](),
        pipe<Output>(mapper: TypedStreamMapper<Input, Output>): TypedStreamOf<Output> {
            return Of(mapper(inputStream))
        }
    }
}

export function of<Input>(stream: TypedStreamLike<Input>): TypedStreamOf<Input> {
    return Of(toTypedStream<Input>(stream));
}


export async function run<T extends any>(stream: TypedStream<T>): Promise<T | undefined> {
    let value: T | undefined = undefined;
    for await (const record of stream) {
        value = record
    }
    return value
}

export const pull = run

