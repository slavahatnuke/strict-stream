import {describe, it} from "vitest";
import {of, StrictStreamMapper} from "../index";
import {map} from "../map";

describe('readme', () => {
  it('of / simple', async function () {
    async function* generateIds() {
      yield 1
      yield 2
      yield 3
    }

    async function example() {
      const stream = of(generateIds())
        .pipe(
          map(async (id) => ({id, name: `User ${id}`}))
        );

      for await (const data of stream) {
        console.log(`Id: ${data.id}, Name: ${data.name}`);
      }
      // Id: 1, Name: User 1
      // Id: 2, Name: User 2
      // Id: 3, Name: User 3
    }

    await example();
  });
  it('of / advanced', async function () {
    async function* generateIds() {
      yield 1
      yield 2
      yield 3
    }

    async function example() {

      // my first stream mapper; maps inputStream to mappedStream;
      function myMap<Input, Output>(mapper: (input: Input) => Promise<Output>): StrictStreamMapper<Input, Output> {
        // receives inputStream
        return (inputStream) => {
          return (
            async function* () {
              // reads input stream
              for await (const record of inputStream) {
                // map values
                yield await mapper(record)
              }
            }
          )()
        };
      }

      const stream = of(generateIds())
        .pipe(
          myMap(async (id) => ({id, name: `User ${id}`}))
        );

      for await (const data of stream) {
        console.log(`Id: ${data.id}, Name: ${data.name}`);
      }
      // Id: 1, Name: User 1
      // Id: 2, Name: User 2
      // Id: 3, Name: User 3
    }

    await example();
  });
})