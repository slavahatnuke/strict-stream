import { describe, it } from 'vitest';
import { pipe, run } from '../index';
import { map } from '../map';
import { tap } from '../tap';
import { from } from '../from';

describe('readme', () => {
  it('pipe', async function () {
    async function example() {
      // composable behavior
      const addFive = pipe(map((input: number) => input + 4)).pipe(
        map(async (input) => input + 1),
      );

      // High order function to manage / compose part of the pipe
      function multiple(x: number) {
        return pipe(map(async (value: number) => value * x));
      }

      const stream = from([1, 2, 3])
        .pipe(addFive)
        .pipe(multiple(2))
        .pipe(tap((value) => console.log(value)));

      await run(stream);
      // 12
      // 14
      // 16
    }

    await example();
  });
});
