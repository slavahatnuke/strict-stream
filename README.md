## strict-stream
[![CI](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml/badge.svg)](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml?branch=master) [![CD](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml/badge.svg)](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml?branch=master)

`strict-stream` is a `TypeScript` library that provides tools to manage strictly typed streams. 

### Why?
It ensures that the data flowing through a stream conforms to a specific data type or structure, which helps catch errors early on, reduce bugs, and make code more reliable and easier to maintain.

### Quick look

```typescript
import {sequence} from "strict-stream/sequence";
import {map} from "strict-stream/map";
import {from} from "strict-stream/from";
import {filter} from "strict-stream/filter";

export async function example() {
  const usersStream =
    from(
      // gives sequence 0,1,2,3,4; sequence is AsyncIterable<number>
      sequence(5)
    )
      .pipe(
        // takes only 0, 2, 3
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
```

1. There is a `sequence` function that generates a sequence of numbers 0,1,2,3,4. 
2. This sequence is filtered using the `filter` function to include only the even numbers (i.e., 0, 2, and 4). 
3. And the resulting sequence is mapped using the `map` function to convert each number into a `user object` with a type, name and id. 
4. Finally `userStreams` is a strictly typed `AsyncIterable<{type: string, id: number, name: string}>`

