import {describe, it} from "vitest";
import {run} from "../index";
import {tap} from "../tap";
import {from} from "../from";
import {flat} from "../flat";

describe('readme', () => {
  it('flat', async function () {

    async function example() {
      const stream = from(
        [
          [1, 2],
          [3, 4],
          5
        ]
      )
        .pipe(
          flat()
        )
        .pipe(
          tap((value) => console.log(value))
        );

      await run(stream)
      // 1
      // 2
      // 3
      // 4
      // 5
    }

    await example();
  });
})