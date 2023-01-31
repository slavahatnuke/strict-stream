import {TypedStream, TypedStreamMapper} from "./type";

export function flat<Type>(): TypedStreamMapper<Type | Type[] | TypedStream<Type>, Type> {
    return (inputStream) => (async function* flatStream(): TypedStream<Type> {
        for await (const record of inputStream) {
            if (record instanceof Object && (
                Array.isArray(record) || Symbol.iterator in record || Symbol.asyncIterator in record
            )) {
                for await (const element of record) {
                    yield element
                }
            } else {
                yield record
            }
        }
    })();
}