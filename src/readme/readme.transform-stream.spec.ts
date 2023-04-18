import { describe, it } from 'vitest';
import { reader } from '../reader';
import { of } from '../index';
import { map } from '../map';

describe('readme', () => {
  it('transform stream', async function () {
    async function example() {
      const array = [1, 2, 3];

      const stream = reader<number>(() => {
        const value = array.shift();
        return value !== undefined ? value : reader.DONE;
      });

      const transformedStream = of(stream).pipe(map((value) => value * 2));

      for await (const value of transformedStream) {
        console.log(value);
      }
      // Output: 2, 4, 6
    }

    await example();
  });
});
