import {Promised, StrictStreamMapper} from "./index";
import {IRead, Read} from "./reader";
import {Buffer, IBuffer} from "./fun/buffer";
import {Concurrency, IPublishToConcurrency} from "./fun/concurrency";
import {syncTick} from "./fun/tick";

export function scale<Input, Output>(max: number, mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output> {
    let outputBuffer: IBuffer<Output>;
    let readInput: IRead<Input>;
    let readOutput: IRead<Output>;
    let concurrencyControl: IPublishToConcurrency<Input>;
    let _error: Error | undefined = undefined;

    async function finish() {
        if(concurrencyControl) {
            await concurrencyControl.finish()
        }

        if(outputBuffer) {
            await outputBuffer.finish()
        }
    }

    return (inputStream) => {
        return {
            [Symbol.asyncIterator](): AsyncIterator<Output> {
                return {
                    throw(e?: any): Promise<IteratorResult<Output, any>> {
                        console.log('>>>>>', e)
                        throw e as Error
                    },
                    async next(): Promise<IteratorResult<Output>> {
                        if (_error) {
                            throw _error
                        }

                        if (!readInput) {
                            readInput = Read<Input>(inputStream)
                        }

                        if (!outputBuffer) {
                            outputBuffer = Buffer<Output>()

                            if (!concurrencyControl) {
                                concurrencyControl = Concurrency<Input>(max, async (input) => {
                                    try {
                                        const output = await mapper(input);
                                        await outputBuffer.write(output)
                                    } catch (error) {
                                        _error = error as Error
                                        finish();
                                    }
                                });
                            }

                            syncTick(async () => {
                                while (true) {
                                    try {
                                        const inputValue = await readInput();
                                        if (inputValue === Read.DONE) {
                                            await finish();
                                            break;
                                        } else {
                                            await concurrencyControl(inputValue);
                                        }
                                    } catch (error) {
                                        _error = error as Error
                                        await finish();
                                    }
                                }
                            })
                        }

                        if (!readOutput) {
                            readOutput = Read<Output>(outputBuffer.stream)
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
    };
}