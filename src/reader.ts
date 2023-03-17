import {Promised, StrictStream} from "./index";

const DONE = Symbol('DONE');

export type IRead<T> = () => Promised<T | typeof DONE>;

export function reader<T>(
    read: IRead<T>
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

export function read<T>(stream: StrictStream<T>): IRead<T> {
    let iterator: AsyncIterator<T>;
    return async () => {
        if (!iterator) {
            iterator = stream[Symbol.asyncIterator]()
        }

        const {done, value} = await iterator.next();

        if (done) {
            return reader.DONE
        } else {
            return value
        }
    }
}

read.DONE = DONE;
reader.DONE = DONE;