import {Promised, StrictStream} from "./index";
import {reader} from "./reader";

export function objectReader<T extends object | object[]>(read: () => Promised<T | null | undefined | boolean | number>): StrictStream<T> {
    return reader<T>(async () => {
        const object = await read();

        if (object instanceof Object) {
            return object;
        }

        return reader.DONE;
    });
}