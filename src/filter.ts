import {TypedMaybeAsync, TypedStream, TypedStreamMapper} from "./type";

export function filter<Input>(condition: (input: Input) => TypedMaybeAsync<boolean | undefined | null>): TypedStreamMapper<Input, Input> {
    return (inputStream) => (async function* filtered(): TypedStream<Input> {
        for await (const record of inputStream) {
            if (await condition(record)) {
                yield record
            }
        }
    })();
}