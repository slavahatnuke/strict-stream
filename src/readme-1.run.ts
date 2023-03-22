import {sequence} from "./sequence";
import {map} from "./map";
import {from} from "./from";
import {filter} from "./filter";

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

example().catch(console.error);