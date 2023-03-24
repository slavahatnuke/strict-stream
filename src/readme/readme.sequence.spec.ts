import {describe, it} from "vitest";
import {of, run} from "../index";
import {tap} from "../tap";
import {sequence} from "../sequence";

describe('readme', () => {
  it('sequence', async function () {

    async function example() {
      const sequenceStream = of(sequence(3))
        .pipe(
          tap(console.log)
        );

      await run(sequenceStream)
      // 0
      // 1
      // 2
    }

    await example();
  });
})