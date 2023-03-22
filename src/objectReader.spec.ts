import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";
import {objectReader} from "./objectReader";


describe(objectReader.name, () => {
  it('array of object', async () => {
    const array = [{id: 1}, {id: 2}]
    const stream = objectReader(() => array.shift());
    expect(await toArray(stream)).toEqual([{id: 1}, {id: 2}])
  });
  it('array of arrays', async () => {
    const array = [[1], [2]]
    const stream = objectReader(() => array.shift());
    expect(await toArray(stream)).toEqual([[1], [2]])
  });
})