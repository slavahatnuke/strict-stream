import {StrictStream, StrictStreamMapper} from "./index";

export function flat<Type>(): StrictStreamMapper<Type | Type[] | StrictStream<Type>, Type> {
    return (inputStream) => (async function* flatStream(): StrictStream<Type> {
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