import {Promised, StrictStream} from "./index";

const DONE = Symbol('DONE');

export type IRead<T> = () => Promised<T | typeof DONE>;

export function Reader<T>(
    read: IRead<T>
): StrictStream<T> {
    return {
        [Symbol.asyncIterator]() {
            return {
                async next() {
                    const value = await read();
                    return {done: value === Reader.DONE, value};
                },
            } as AsyncIterator<T>;
        },
    }
}

export function Read<T>(stream: StrictStream<T>): IRead<T> {
    let iterator: AsyncIterator<T>;
    return async () => {
        if (!iterator) {
            iterator = stream[Symbol.asyncIterator]()
        }

        const {done, value} = await iterator.next();

        if (done) {
            return Reader.DONE
        } else {
            return value
        }
    }
}

Read.DONE = DONE;
Reader.DONE = DONE;