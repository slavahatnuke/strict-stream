import { StrictStream, StrictStreamMapper } from './index';

export function batch<Input>(size: number): StrictStreamMapper<Input, Input[]> {
  let batched: Input[] = [];
  return (inputStream) =>
    (async function* batchedStream(): StrictStream<Input[]> {
      for await (const record of inputStream) {
        batched.push(record);

        if (batched.length >= size) {
          const toEmit = batched;
          batched = [];
          yield toEmit;
        }
      }

      if (batched.length) {
        const toEmit = batched;
        batched = [];
        yield toEmit;
      }
    })();
}
