import { describe, expect, it } from 'vitest';
import { tap } from './tap';
import { from } from './from';
import { toArray } from './toArray';

describe(tap.name, () => {
  it('does not modify the pipeline', async () => {
    const collectedValues: number[] = [];
    const stream = from([1, 2, 3]).pipe(
      tap(async (value) => {
        collectedValues.push(value);
        return 'ANY';
      }),
    );

    const outputs = await toArray(stream);

    expect(outputs).toEqual([1, 2, 3]);
    expect(collectedValues).toEqual([1, 2, 3]);
  });
});
