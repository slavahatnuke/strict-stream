import { describe, expect, it } from 'vitest';
import { merge } from './merge';
import { from } from './from';
import { toArray } from './toArray';
import { tap } from './tap';
import { delay } from './fun/delay';

describe(merge.name, () => {
  it('test', async () => {
    const usersV1Stream = from([{ type: 'userV1', name: 'User Name' }]).pipe(
      tap(() => delay(100)),
    );

    const usersV2Stream = from([
      { type: 'userV2', firstName: 'User', lastName: 'Name' },
    ]);
    const usersStream = merge(usersV1Stream, usersV2Stream);

    expect(await toArray(usersStream)).toEqual([
      { type: 'userV2', firstName: 'User', lastName: 'Name' },
      { type: 'userV1', name: 'User Name' },
    ]);
  });
});
