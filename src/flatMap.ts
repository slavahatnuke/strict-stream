import { flat } from './flat';
import { map } from './map';
import { pipe, Promised, StrictStreamLike, StrictStreamMapper } from './index';

export function flatMap<Input, Output>(
  mapper: (input: Input) => Promised<Output | StrictStreamLike<Output>>,
): StrictStreamMapper<Input, Output> {
  return pipe(map(mapper)).pipe(flat());
}
