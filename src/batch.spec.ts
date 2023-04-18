import { describe, expect, it } from 'vitest';
import { from } from './from';
import { toArray } from './toArray';
import { batch } from './batch';

describe(batch.name, () => {
  it('filter values', async () => {
    const stream = from([1, 2, 3]).pipe(batch(2));

    const outputs = await toArray(stream);

    expect(outputs).toEqual([[1, 2], [3]]);
  });
});
