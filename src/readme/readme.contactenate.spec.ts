import { describe, it } from 'vitest';
import { from } from '../from';
import { concatenate } from '../concatenate';
import { run } from '../index';
import { tap } from '../tap';

describe('readme', () => {
  it('from', async function () {
    async function* generateIds() {
      yield 10;
      yield 20;
      yield 30;
    }

    async function example() {
      const streamLike1: Iterable<number> = [1, 2, 3];
      const streamLike2: AsyncIterable<number> = generateIds(); // is equivalent

      // could consume `streamLike1` or `streamLike2`
      const stream = from(
        concatenate(from(streamLike1), from(streamLike2)),
      ).pipe(tap((value) => console.log(value)));

      await run(stream);
      // 1
      // 2
      // 3
      // 10
      // 20
      // 30
    }

    await example();
  });
});
