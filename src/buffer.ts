import {StrictStream, StrictStreamMapper} from "./index";
import {IRead, read} from "./reader";
import {IWriter, Writer} from "./writer";
import {syncTick} from "./fun/tick";

export function buffer<Input>(size: number): StrictStreamMapper<Input, Input> {
    let outputBuffer: IWriter<Input>;
    let readInput: IRead<Input>;
    let readOutput: IRead<Input>;
    let _error: Error | undefined = undefined;

    async function finish() {
        if (outputBuffer) {
            await outputBuffer.finish()
        }
    }

    return (inputStream: StrictStream<Input>) => {
        return {
            [Symbol.asyncIterator](): AsyncIterator<Input> {
                return {
                    async next(): Promise<IteratorResult<Input>> {
                        if (_error) {
                            throw _error
                        }

                        if (!readInput) {
                            readInput = read<Input>(inputStream)
                        }

                        if (!outputBuffer) {
                            outputBuffer = Writer<Input>(size)

                            syncTick(async () => {
                                while (true) {
                                    try {
                                        const inputValue = await readInput();
                                        if (inputValue === read.DONE) {
                                            await finish();
                                            break;
                                        } else {
                                            await outputBuffer.write(inputValue)
                                        }
                                    } catch (error) {
                                        _error = error as Error
                                        await finish();
                                    }
                                }
                            })
                        }

                        if (!readOutput) {
                            readOutput = read<Input>(outputBuffer.stream)
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