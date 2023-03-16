import {Promised, StrictStream} from "./index";

const DONE = Symbol('DONE');

export function reader<T>(
    read: () => Promised<T | typeof DONE>
): StrictStream<T> {
    return {
        [Symbol.asyncIterator]() {
            return {
                async next() {
                    const value = await read();
                    return {done: value === reader.DONE, value};
                },
            } as AsyncIterator<T>;
        },
    }
}

reader.DONE = DONE;