import {TypedMaybeAsync, TypedStream, TypedStreamMapper} from "./type";

export function map<Input, Output>(mapper: (input: Input) => TypedMaybeAsync<Output>): TypedStreamMapper<Input, Output> {
    return (inputStream) => (async function* mappedStream(): TypedStream<Output> {
        for await (const record of inputStream) {
            yield await mapper(record)
        }
    })();
}