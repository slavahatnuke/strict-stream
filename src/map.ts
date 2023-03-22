import {Promised, StrictStream, StrictStreamMapper} from "./index";

export function map<Input, Output>(mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output> {
  return (inputStream) => (async function* mappedStream(): StrictStream<Output> {
    for await (const record of inputStream) {
      yield await mapper(record)
    }
  })();
}