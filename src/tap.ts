import {map} from "./map";
import {Promised, StrictStreamMapper} from "./index";

export function tap<Input>(fn: (input: Input) => Promised<any>): StrictStreamMapper<Input, Input> {
  return map<Input, Input>(async (input): Promise<Input> => {
    await fn(input)
    return input
  })
}