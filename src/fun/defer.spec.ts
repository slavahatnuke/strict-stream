import { describe, expect, it } from 'vitest';
import { Defer } from './defer';

describe(Defer.name, () => {
  it('resolve', async () => {
    const defer = Defer<number>();
    setTimeout(() => defer.resolve(123), 10);

    expect(await defer.promise).toEqual(123);
  });

  it('reject', async () => {
    const defer = Defer<number>();
    setTimeout(() => defer.reject(new Error('woops')), 10);

    expect(async () => {
      await defer.promise;
    }).rejects.toThrow('woops');
  });
});
