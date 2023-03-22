import {Writer} from "./writer";
import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";

describe(Writer.name, () => {

  it('keeps buffer', async function () {

    const streamWriter = Writer<number>(4);
    expect(streamWriter.length()).toEqual(0);
    await streamWriter.write(1)
    expect(streamWriter.length()).toEqual(1);
    await streamWriter.write(2)
    expect(streamWriter.length()).toEqual(2);
    await streamWriter.write(3)
    expect(streamWriter.length()).toEqual(3);

    let p4Resolved = false;

    const p4 = streamWriter.write(4);

    p4.then(() => {
      p4Resolved = true;
    })

    expect(p4Resolved).toEqual(false)

    expect(streamWriter.length()).toEqual(4);

    setTimeout(() => streamWriter.finish(), 0)
    const numbers = await toArray(streamWriter.stream);

    expect(p4Resolved).toEqual(true)
    expect(streamWriter.length()).toEqual(0);
    expect(numbers).toEqual([1, 2, 3, 4])
  });
})