import {describe, it} from "vitest";
import {of, run} from "../index";
import {sequence} from "../sequence";
import {reduce} from "../reduce";

describe('readme', () => {
  it('reduce', async function () {

    async function example() {
      const stream = of(sequence(5))
        .pipe(
          reduce(({counter}) => ({counter: counter + 1}), {counter: 0})
        );

      const result = await run(stream);
      console.log(result)
      // { counter: 5 }
    }

    await example();
  });
})