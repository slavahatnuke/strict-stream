import { describe, it } from 'vitest';
import { run, StrictStreamOf } from '../index';
import { tap } from '../tap';
import { from } from '../from';
import { flatMap } from '../flatMap';
import { map } from '../map';

describe('readme', () => {
  it(flatMap.name, async function () {
    async function example() {
      type User = {
        id: number;
        name: string;
        orders: Order[];
      };

      type Order = {
        id: number;
        product: string;
        price: number;
      };

      const users: User[] = [
        {
          id: 1,
          name: 'Alice',
          orders: [
            { id: 101, product: 'Widget A', price: 10.0 },
            { id: 102, product: 'Widget B', price: 20.0 },
          ],
        },
        {
          id: 2,
          name: 'Bob',
          orders: [
            { id: 201, product: 'Widget C', price: 30.0 },
            { id: 202, product: 'Widget D', price: 40.0 },
            { id: 203, product: 'Widget E', price: 50.0 },
          ],
        },
      ];

      async function fetchStreamOfUsers(): Promise<StrictStreamOf<User>> {
        return from(users);
      }

      // StrictStreamOf<{userId: number, orderId: number}
      const stream = (await fetchStreamOfUsers())
        .pipe(
          flatMap(async (user) => {
            return from(user.orders).pipe(
              map(async (order) => {
                return {
                  userId: user.id,
                  orderId: order.id,
                  price: order.price,
                };
              }),
            );
          }),
        )
        .pipe(tap((value) => console.log(value)));

      await run(stream);
      // { userId: 1, orderId: 101, price: 10 }
      // { userId: 1, orderId: 102, price: 20 }
      // { userId: 2, orderId: 201, price: 30 }
      // { userId: 2, orderId: 202, price: 40 }
      // { userId: 2, orderId: 203, price: 50 }
    }

    await example();
  });
});
