import { delay } from './delay';
import { tick } from './tick';
import { describe, expect, it } from 'vitest';
import { keepConcurrency } from './keepConcurrency';
import { KeyedConcurrency } from './keyedConcurrency';

describe(KeyedConcurrency.name, () => {
  it('keyed concurrency / 2 and undefined key', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = KeyedConcurrency<{ xKey: string | undefined; value: number }>(
      2,
      ({ xKey }) => xKey,
      async (data) => {
        await delay(200);
        counter++;
        return data;
      },
    );

    const result1 = await send({ xKey: undefined, value: 1 });
    const result2 = await send({ xKey: undefined, value: 2 });

    await send.finish();

    const d2 = Date.now();

    // console.log(d2 - d1)
    expect(Math.round((d2 - d1) / 200)).toEqual(1);
    expect(counter).toEqual(2);

    expect(await result1()).toEqual({ value: 1, xKey: undefined });
    expect(await result2()).toEqual({ value: 2, xKey: undefined });
  });

  it('keyed concurrency / 2 and same key', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = KeyedConcurrency<{ xKey: string | undefined; value: number }>(
      2,
      async ({ xKey }) => xKey,

      async (data) => {
        // console.log('worker', {data})
        await delay(200);
        counter++;
        return data;
      },
    );

    const resultResolver1 = await send({ xKey: 'k1', value: 1 });
    const resultResolver2 = await send({ xKey: 'k1', value: 2 });

    await send.finish();

    const d2 = Date.now();

    // console.log(d2 - d1)

    expect(Math.round((d2 - d1) / 200)).toEqual(2);
    expect(counter).toEqual(2);

    expect(await resultResolver1()).toEqual({ value: 1, xKey: 'k1' });
    expect(await resultResolver2()).toEqual({ value: 2, xKey: 'k1' });
  });

  it('keyed concurrency / 2 and different keys', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = KeyedConcurrency<{ xKey: string | undefined; value: number }>(
      2,
      async ({ xKey }) => xKey,

      async (data) => {
        // console.log('worker', {data})
        await delay(200);
        counter++;
        return data;
      },
    );

    const resultResolver1 = await send({ xKey: 'k1', value: 1 });
    const resultResolver2 = await send({ xKey: 'k2', value: 2 });

    await send.finish();

    const d2 = Date.now();

    // console.log(d2 - d1)

    expect(Math.round((d2 - d1) / 200)).toEqual(1);
    expect(counter).toEqual(2);

    expect(await resultResolver1()).toEqual({ value: 1, xKey: 'k1' });
    expect(await resultResolver2()).toEqual({ value: 2, xKey: 'k2' });
  });

  it('keepConcurrency / 2', async function () {
    const d1 = Date.now();

    let counter = 0;

    const stop = keepConcurrency(2, async () => {
      counter++;
      await delay(200);
    });

    await tick(async () => {
      await delay(10);
      await stop();
    });

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 1).toEqual(true);
    expect(counter).toEqual(2);
  });

  it('keepConcurrency / 1', async function () {
    const d1 = Date.now();
    let counter = 0;
    const stop = keepConcurrency(1, async () => {
      await delay(200);
      counter++;
    });

    await tick(async () => {
      await delay(10);
      await stop();
    });

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 1).toEqual(true);
    expect(counter).toEqual(1);
  });

  it('keepConcurrency / 20', async function () {
    const d1 = Date.now();

    let counter = 0;

    const stop = keepConcurrency(20, async () => {
      counter++;
      await delay(200);
    });

    await tick(async () => {
      await delay(50);
      await stop();
    });

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 1).toEqual(true);
    expect(counter).toEqual(20);
  });

  it('keyed concurrency / on error', async function () {
    const send = KeyedConcurrency<{ xKey: string | undefined; value: number }>(
      2,
      async ({ xKey }) => xKey,

      async () => {
        throw new Error(`Woop`);
      },
    );

    const resultResolver1 = await send({ xKey: 'k1', value: 1 });
    const resultResolver2 = await send({ xKey: 'k1', value: 2 });

    await expect(async function () {
      await Promise.all([resultResolver1(), resultResolver2()]);
    }).rejects.toThrow('Woop');

    await send.finish();
  });
});
