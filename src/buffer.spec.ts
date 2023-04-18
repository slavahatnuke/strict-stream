import { describe, expect, it } from 'vitest';
import { sequence } from './sequence';
import { of } from './index';
import { toArray } from './toArray';
import { tap } from './tap';
import { buffer } from './buffer';

describe(buffer.name, () => {
  it('buffer', async function () {
    const d1 = Date.now();
    const out = of(sequence(4)).pipe(buffer(3));

    const outputs = await toArray(out);
    const d2 = Date.now();

    expect(outputs.sort()).toEqual([0, 1, 2, 3]);
    expect(Math.round((d2 - d1) / 100)).toEqual(0);
  });

  it('buffer / source / error', async function () {
    await expect(async () => {
      const out = of(sequence(4))
        .pipe(
          tap(() => {
            throw new Error('Source Error');
          }),
        )
        .pipe(buffer(4));

      await toArray(out);
    }).rejects.toThrow(`Source Error`);
  });
});
