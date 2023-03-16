import {map} from "./map";
import {StrictStreamPromised, StrictStreamMapper} from "./index";

export function tap<Input>(fn: (input: Input) => StrictStreamPromised<any>): StrictStreamMapper<Input, Input> {
    return map<Input, Input>(async (input): Promise<Input> => {
        await fn(input)
        return input
    })
}