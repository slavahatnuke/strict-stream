import { describe, it } from 'vitest';
import { map } from '../map';
import { from } from '../from';

describe('readme', () => {
  it('from', async function () {
    async function* generateIds() {
      yield 1;
      yield 2;
      yield 3;
    }

    async function example() {
      const streamLike1: Iterable<number> = [1, 2, 3];
      const streamLike2: AsyncIterable<number> = generateIds(); // is equivalent

      // could consume `streamLike1` or `streamLike2`
      const stream = from(streamLike1).pipe(
        map(async (id) => ({ id, name: `User ${id}` })),
      );

      for await (const data of stream) {
        console.log(`Id: ${data.id}, Name: ${data.name}`);
      }
      // Id: 1, Name: User 1
      // Id: 2, Name: User 2
      // Id: 3, Name: User 3
    }

    await example();
  });
});
