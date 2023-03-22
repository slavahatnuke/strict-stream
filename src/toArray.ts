import {StrictStream} from "./index";

export async function toArray<T>(input: StrictStream<T>): Promise<T[]> {
  const values: T[] = [];
  for await (const value of input) {
    values.push(value)
  }
  return values;
}