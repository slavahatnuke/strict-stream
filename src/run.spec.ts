import { describe, expect, it } from 'vitest';
import { from } from './from';
import { run } from './index';

describe(run.name, () => {
  it('returns last value', async () => {
    const stream = from([1, 2, 3]);
    const lastValue = await run(stream, null);
    expect(lastValue).toEqual(3);
  });

  it('returns default value when stream is empty', async () => {
    const stream = from([]);
    const defaultValue = Symbol('TO_TEST');
    const lastValue = await run(stream, defaultValue);
    expect(lastValue).toEqual(defaultValue);
  });
});
