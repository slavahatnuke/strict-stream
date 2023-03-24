import {sequence} from "../sequence";
import {map} from "../map";
import {from} from "../from";
import {filter} from "../filter";

import {describe, it} from "vitest";
import {of} from "../index";

describe('readme', () => {
  it('intro', async function () {
    async function* generateData() {
      yield {name: 'Alice', age: 30};
      yield {name: 'Bob', age: 40};
      yield {name: 'Charlie', age: 50};
    }

    async function example() {
      // const stream: AsyncIterable<{name: string, age: number}>
      const stream = of(generateData())
        .pipe(filter(({age}) => age > 30));

      for await (const data of stream) {
        console.log(`Name: ${data.name}, Age: ${data.age}`);
      }
      // Name: Bob, Age: 40
      // Name: Charlie, Age: 50
    }

    await example();
  });

  it('A quick look at transformations', async () => {

    async function example() {

      const usersStream =
        from(
          // gives sequence 0,1,2,3,4;
          // sequence is AsyncIterable<number>
          sequence(5)
        )
          .pipe(
            // takes only 0, 2, 4
            filter((id) => id % 2 === 0)
          )
          .pipe(
            // maps to {type: string, id: number, name: string}
            map((id) => ({type: 'User', id, name: `User ${id}`}))
          )

      // usersStream is AsyncIterable<{type: string, id: number, name: string}>
      for await (const user of usersStream) {
        console.log(user)
      }

      // { type: 'User', id: 0, name: 'User 0' }
      // { type: 'User', id: 2, name: 'User 2' }
      // { type: 'User', id: 4, name: 'User 4' }
    }
  });
})