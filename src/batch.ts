import {TypedStream, TypedStreamMapper} from "./type";

export function batch<Input>(size: number): TypedStreamMapper<Input, Input[]> {
    let batched: Input[] = [];
    return (inputStream) => (async function* batchedStream(): TypedStream<Input[]> {
        for await (const record of inputStream) {
            batched.push(record);

            if (batched.length >= size) {
                const toEmit = batched;
                batched = [];
                yield toEmit;
            }
        }

        if (batched.length) {
            const toEmit = batched;
            batched = [];
            yield toEmit;
        }
    })();
}