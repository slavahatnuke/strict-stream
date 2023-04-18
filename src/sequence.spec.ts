import { describe, expect, it } from 'vitest';
import { from } from './from';
import { toArray } from './toArray';
import { sequence } from './sequence';

describe(sequence.name, () => {
  it('gives the sequence', async () => {
    const stream = from(sequence(5));
    const outputs = await toArray(stream);

    expect(outputs).toEqual([0, 1, 2, 3, 4]);
  });
});
