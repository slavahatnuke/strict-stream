import {describe, it} from "vitest";
import {of, run} from "../index";
import {tap} from "../tap";
import {map} from "../map";
import {interval} from "../interval";

describe('readme', () => {
  it('interval', async function () {

    async function example() {
      // every 300ms
      const source = interval(300);

      let counter = 0;

      const stream = of(source)
        .pipe(
          map(() => {
            counter++

            if (counter > 3) {
              // stops the interval stream
              source.stop()
            }

            return counter;
          })
        )
        .pipe(
          tap((value) => console.log(value))
        )

      await run(stream)
      // 1
      // 2
      // 3
      // 4
    }

    await example();
  });
})