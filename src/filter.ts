import {StrictStreamPromised, StrictStream, StrictStreamMapper} from "./index";

export function filter<Input>(condition: (input: Input) => StrictStreamPromised<boolean | undefined | null>): StrictStreamMapper<Input, Input> {
    return (inputStream) => (async function* filtered(): StrictStream<Input> {
        for await (const record of inputStream) {
            if (await condition(record)) {
                yield record
            }
        }
    })();
}