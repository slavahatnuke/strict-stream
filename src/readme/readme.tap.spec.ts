import {describe, it} from "vitest";
import {of} from "../index";
import {tap} from "../tap";

describe('readme', () => {
  it('transform stream', async function () {

    async function example() {
      async function* generateIds() {
        yield 1
        yield 2
        yield 3
      }

      const transformedStream = of(generateIds())
        .pipe(
          tap((value) => console.log(value))
        );

      for await (const value of transformedStream) { /* empty */ }
      // 1
      // 2
      // 3
    }

    await example();
  });
})