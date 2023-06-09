import { describe, it } from 'vitest';
import { of, run } from '../index';
import { tap } from '../tap';

describe('readme', () => {
  it('run', async function () {
    async function example() {
      async function* generateIds() {
        yield 1;
        yield 2;
        yield 3;
      }

      const stream = of(generateIds()).pipe(tap((value) => console.log(value)));

      await run(stream);
      // 0
      // 1
      // 2
    }

    await example();
  });
});
