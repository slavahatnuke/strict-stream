import {sequence} from "../sequence";
import {from} from "../from";
import {filter} from "../filter";

import {describe, it} from "vitest";

describe('readme', () => {
  it('benchmark', async () => {
    async function benchmark() {
      const size = 10_000_000; // 10M
      const stream =
        from(
          sequence(size)
        )
          .pipe(
            filter((id) => id % 2 === 0)
          )

      const startedAt = Date.now()
      for await (const record of stream) { /* empty */ }
      const finishedAt = Date.now()

      const recordsPerSecond = (size / (finishedAt - startedAt)) * 1000
      console.log({recordsPerSecond: Math.floor(recordsPerSecond)})

      // { recordsPerSecond: 3021148 }
      // 3M records per second
    }

    await benchmark()
  });
})