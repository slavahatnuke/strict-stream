import {StrictStreamMapper} from "./index";
import {IRead, read} from "./reader";
import {IWriter, Writer} from "./writer";
import {syncTick} from "./fun/tick";
import {clearTimeout} from "timers";

type Milliseconds = number;

export function batchTimed<Input>(size: number, maxTimeout: Milliseconds): StrictStreamMapper<Input, Input[]> {
    let outputBuffer: IWriter<Input[]>;
    let readInput: IRead<Input>;
    let readOutput: IRead<Input[]>;
    let _error: Error | undefined = undefined;
    let batch: Input[] = [];
    let flushTimeout: any;

    async function finish() {
        await flush()
        if (outputBuffer) {
            await outputBuffer.finish()
        }
    }

    async function flush() {
        if (outputBuffer) {
            if (batch.length) {
                const currentBatch: Input[] = [...batch];
                batch = []
                await outputBuffer.write(currentBatch)
            }
        }
    }

    function clearFlushTimeout() {
        if (flushTimeout) {
            clearTimeout(flushTimeout)
            flushTimeout = null
        }
    }

    return (inputStream) => {
        return {
            [Symbol.asyncIterator](): AsyncIterator<Input[]> {
                return {
                    async next(): Promise<IteratorResult<Input[]>> {
                        if (_error) {
                            throw _error
                        }

                        if (!readInput) {
                            readInput = read<Input>(inputStream)
                        }

                        if (!outputBuffer) {
                            outputBuffer = Writer<Input[]>()
                            syncTick(async () => {
                                while (true) {
                                    try {
                                        const inputValue = await readInput();
                                        if (inputValue === read.DONE) {
                                            // process finished
                                            await finish();
                                            break;
                                        } else {
                                            // new incoming data
                                            batch.push(inputValue)

                                            clearFlushTimeout();

                                            flushTimeout = setTimeout(async () => {
                                                try {
                                                    await flush()
                                                } catch (error) {
                                                    _error = error as Error
                                                }
                                            }, maxTimeout);

                                            if (batch.length >= size) {
                                                await flush();
                                            }
                                        }
                                    } catch (error) {
                                        _error = error as Error
                                        await finish();
                                    }
                                }
                            })
                        }

                        if (!readOutput) {
                            readOutput = read<Input[]>(outputBuffer.stream)
                        }

                        const output = await readOutput();

                        if (_error) {
                            throw _error
                        }

                        if (output === read.DONE) {
                            return {done: true, value: undefined}
                        } else {
                            return {done: false, value: output}
                        }
                    }
                }
            }
        }
    };
}