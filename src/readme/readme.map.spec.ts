import {describe, it} from "vitest";
import {of, run} from "../index";
import {tap} from "../tap";
import {sequence} from "../sequence";
import {map} from "../map";

describe('readme', () => {
  it('map', async function () {

    async function example() {
      const sequenceStream = of(sequence(3))
        .pipe(
          map((id) => id * 2)
        )
        .pipe(
          tap((value) => console.log(value))
        );

      await run(sequenceStream)
      // 0
      // 2
      // 4
    }

    await example();
  });
})