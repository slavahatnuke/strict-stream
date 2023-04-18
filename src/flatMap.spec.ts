import { flatMap } from './flatMap';
import { describe, expect, it } from 'vitest';
import { from } from './from';
import { toArray } from './toArray';

describe(flatMap.name, () => {
  it('test flatMap default', async function () {
    const out = from([
      [1], // -> 1
      2, // -> 2
      [33], // -> 33
      [44], // -> 44 only one array should be unwrapped
    ]).pipe(flatMap((pass) => pass));

    expect(await toArray(out)).toEqual([1, 2, 33, 44]);
  });

  it('test flatMap works as map', async function () {
    const expected: number[] = [];

    const out = from([
      1, // -> 10
      2, // -> 20
      3, // -> 30
    ]).pipe(flatMap((x) => x * 10));

    expect(await toArray(out)).toEqual([10, 20, 30]);
  });

  it('test flatMap stream', async function () {
    const out = from([
      1, // -> 10
      2, // -> 20
      3, // -> 30
    ]).pipe(
      flatMap(async (value) => {
        return from([value, value * 2, value * 3]);
      }),
    );

    expect(await toArray(out)).toEqual([
      1, 2, 3,

      2, 4, 6,

      3, 6, 9,
    ]);
  });
});
