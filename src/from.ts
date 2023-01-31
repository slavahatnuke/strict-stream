import {of, TypedStream, TypedStreamLike, TypedStreamOf} from "./index";

export function toTypedStream<Input>(stream: TypedStreamLike<Input>): TypedStream<Input> {
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
        throw new Error(`Impossible to make a stream, got ${typeof stream}, is not iterable`)
    }
}

export function from<Input>(streamLike: TypedStreamLike<Input>): TypedStreamOf<Input> {
    return of(toTypedStream<Input>(streamLike));
}