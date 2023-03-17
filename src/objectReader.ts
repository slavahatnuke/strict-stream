import {Promised, StrictStream} from "./index";
import {Reader} from "./reader";

export function ObjectReader<T extends object | object[]>(read: () => Promised<T | null | undefined | boolean | number>): StrictStream<T> {
    return Reader<T>(async () => {
        const object = await read();

        if (object instanceof Object) {
            return object;
        }

        return Reader.DONE;
    });
}