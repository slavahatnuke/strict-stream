import {map} from "./map";
import {TypedMaybeAsync, TypedStreamMapper} from "./type";

export function tap<Input>(fn: (input: Input) => TypedMaybeAsync<any>): TypedStreamMapper<Input, Input> {
    return map<Input, Input>(async (input): Promise<Input> => {
        await fn(input)
        return input
    })
}