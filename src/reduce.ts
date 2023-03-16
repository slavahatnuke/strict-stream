import {Promised, StrictStream, StrictStreamMapper} from "./index";

export function reduce<Input, Accumulator>(reducer: (accumulator: Accumulator, input: Input) => Promised<Accumulator>, initial: Accumulator): StrictStreamMapper<Input, Accumulator> {
    return (inputStream) => (async function* reduced(): StrictStream<Accumulator> {
        let finalValue: Accumulator = initial;
        for await (const input of inputStream) {
            finalValue = await reducer(finalValue, input)
        }
        yield finalValue
    })();
}