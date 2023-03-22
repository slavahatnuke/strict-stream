import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";

describe(toArray.name, () => {
  it('collects values', async () => {
    const stream = from([1, 2, 3]);
    const outputs = await toArray(stream);

    expect(outputs).toEqual([1, 2, 3])
  });
})