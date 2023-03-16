import {of, StrictStream, StrictStreamLike, StrictStreamOf} from "./index";

export function toTypedStream<Input>(stream: StrictStreamLike<Input>): StrictStream<Input> {
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
        throw new Error(`${typeof stream}, is not iterable`)
    }
}

export function from<Input>(streamLike: StrictStreamLike<Input>): StrictStreamOf<Input> {
    return of(toTypedStream<Input>(streamLike));
}