import {describe, it} from "vitest";
import {of, run} from "../index";
import {tap} from "../tap";
import {sequence} from "../sequence";
import {scaleSync} from "../scaleSync";

describe('readme', () => {
  it('scaleSync', async function () {

    async function fetchUserById(id: number) {
      // some logic to fetch the use
      return {
        id,
        userName: `User ${id}`
      };
    }

    async function getUserIds() {
      return sequence(3);
    }

    async function example() {
      const usersStream = of(await getUserIds())
        .pipe(
          // run's the async queries concurrently, keeps the ordering of output stream unchanged
          scaleSync(5, async (id) => fetchUserById(id))
        )
        .pipe(
          tap((value) => console.log(value))
        );

      await run(usersStream)
      // { id: 0, userName: 'User 0' }
      // { id: 1, userName: 'User 1' }
      // { id: 2, userName: 'User 2' }
    }

    await example();
  });
})