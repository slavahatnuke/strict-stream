import {describe, it} from "vitest";
import {of, run} from "../index";
import {tap} from "../tap";
import {sequence} from "../sequence";
import {map} from "../map";
import {filter} from "../filter";

describe('readme', () => {
  it('filter', async function () {

    async function example() {
      const stream = of(sequence(3))
        .pipe(
          filter((id) => id > 0)
        )
        .pipe(
          tap(console.log)
        );

      await run(stream)
      // 1
      // 2
    }

    await example();
  });
})