import {of, StrictStreamMapper} from "./index";
import {Readable, ReadableOptions, Transform} from "stream";

export function nodeTransform<Input, Output>(transform: Transform, options: ReadableOptions = {}): StrictStreamMapper<Input, Output> {
    return (inputStream) => of(
        Readable.from(inputStream, options).pipe(transform)
    );
}