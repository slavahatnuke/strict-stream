import { describe, it } from 'vitest';
import { of, run } from '../index';
import { tap } from '../tap';
import { sequence } from '../sequence';
import { batch } from '../batch';

describe('readme', () => {
  it('batch', async function () {
    async function example() {
      const stream = of(sequence(3))
        .pipe(batch(2))
        .pipe(tap((value) => console.log(value)));

      await run(stream);
      // Output
      // [ 0, 1 ]
      // [ 2 ]
    }

    await example();
  });
});
