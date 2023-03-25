import {describe, it} from "vitest";
import {reader} from "../reader";

describe('readme', () => {
  it('create-stream / generator', async function () {
    async function* generateData() {
      yield {name: 'Alice', age: 30};
      yield {name: 'Bob', age: 40};
      yield {name: 'Charlie', age: 50};
    }

    async function example() {
      const stream = generateData();

      for await (const data of stream) {
        console.log(`Name: ${data.name}, Age: ${data.age}`);
      }
      // Output:
      // Name: Alice, Age: 30
      // Name: Bob, Age: 40
      // Name: Charlie, Age: 50
    }

    await example();
  });

  it('create-stream / reader', async function () {
    async function example() {
      const array = [1, 2]
      const stream = reader<number>(() => {
        const value = array.shift();
        return value || reader.DONE
      });

      for await (const id of stream) {
        console.log(`ID: ${id}`);
      }
      // ID: 1
      // ID: 2
    }

    await example();
  });
})