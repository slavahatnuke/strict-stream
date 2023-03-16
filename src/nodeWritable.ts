import {StrictStream, StrictStreamMapper} from "./index";
import {Writable} from "stream";
import {Defer} from "./fun/defer";

export function nodeWritable<Type>(writable: Writable, encoding: BufferEncoding = 'utf-8'): StrictStreamMapper<Type, Type> {
    return (inputStream) => (async function* _nodeWritable(): StrictStream<Type> {
        const deferEnd = Defer<void>();
        writable.on('error', (error) => deferEnd.reject(error))

        try {
            for await (const value of inputStream) {
                const defer = Defer<void>();
                writable.write(value, encoding, (error) => {

                    if (error) {
                        defer.reject(error)
                    } else {
                        defer.resolve()
                    }
                })

                await defer.promise;
                yield value
            }

            writable.end(() => {
                deferEnd.resolve()
            })
        } catch (error) {
            deferEnd.reject(error as Error)
        }

        await deferEnd.promise
    })();
}