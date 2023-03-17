import {StrictStream} from "./index";
import {IRead, Read} from "./reader";
import {Writer, IWriter} from "./writer";
import {syncTick} from "./fun/tick";

// TODO better types
export function merge<Type>(...streams: StrictStream<any>[]): StrictStream<Type> {
    let outputBuffer: IWriter<Type>;
    let readOutput: IRead<Type>;
    let _error: Error | undefined = undefined;

    async function finish() {
        if (outputBuffer) {
            await outputBuffer.finish()
        }
    }

    return {
        [Symbol.asyncIterator](): AsyncIterator<Type> {
            return {
                async next(): Promise<IteratorResult<Type>> {
                    if (_error) {
                        throw _error
                    }

                    if (!outputBuffer) {
                        outputBuffer = Writer<Type>()

                        syncTick(async () => {
                            try {
                                await Promise.all(streams.map(async (stream) => {
                                    const read = Read(stream);
                                    while (true) {
                                        if (_error) {
                                            break;
                                        }
                                        const value = await read();

                                        if (value === Read.DONE) {
                                            break;
                                        } else {
                                            await outputBuffer.write(value)
                                        }
                                    }
                                }))

                                await finish()
                            } catch (error) {
                                _error = error as Error;
                            }
                        })
                    }

                    if (!readOutput) {
                        readOutput = Read<Type>(outputBuffer.stream)
                    }

                    const output = await readOutput();

                    if (_error) {
                        throw _error
                    }

                    if (output === Read.DONE) {
                        return {done: true, value: undefined}
                    } else {
                        return {done: false, value: output}
                    }
                }
            }
        }
    }
}