import { Concurrency } from './concurrency';
import { delay } from './delay';
import { describe, expect, it } from 'vitest';

describe(Concurrency.name, () => {
  it('concurrency / 2', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = Concurrency<string>(2, async (data) => {
      await delay(200);
      counter++;
      return `echo-${data}`;
    });

    await send('1');
    await send('2');

    await send.finish();

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 1).toEqual(true);
    expect(counter).toEqual(2);
  });

  it('concurrency / 1 & results', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = Concurrency<string>(1, async (data) => {
      await delay(200);
      counter++;
      return `echo-${data}`;
    });

    const result1 = await send('1');
    const result2 = await send('2');

    await send.finish();

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 2).toEqual(true);
    expect(counter).toEqual(2);

    expect(await result1()).toEqual('echo-1');
    expect(await result2()).toEqual('echo-2');
  });

  it('concurrency / 2 & 3 messages and back pressure / tested without finishing 3rd message', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = Concurrency<string>(2, async (data) => {
      await delay(200);
      counter++;
      return `echo-${data}`;
    });

    await send('1');
    await send('2');
    await send('3'); // back pressured & no finish

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 1).toEqual(true);
    expect(counter).toEqual(1);
  });

  it('concurrency / 2 & 3 messages and back pressure', async function () {
    const d1 = Date.now();

    let counter = 0;

    const send = Concurrency<string>(2, async (data) => {
      counter++;
      await delay(200);
      return `echo-${data}`;
    });

    await send('1');
    await send('2');
    await send('3'); // back pressured & WITH finish

    await send.finish();

    const d2 = Date.now();

    expect(Math.round((d2 - d1) / 200) === 2).toEqual(true);
    expect(counter).toEqual(3);
  });

  it('concurrency / 2 & 3 messages / quantity and counter', async function () {
    let counter = 0;

    const send = Concurrency<string>(2, async (data) => {
      counter++;
      await delay(200);
      return `echo-${data}`;
    });

    send('1'); // uncontrolled
    send('2'); // uncontrolled
    send('3'); // uncontrolled
    send('4'); // uncontrolled
    send('5'); // uncontrolled

    expect(send.counter.value()).toEqual(2);
    expect(send.quantity.value()).toEqual(5);
  });

  it('concurrency / on error', async function () {
    const send = Concurrency<string>(2, async (data) => {
      throw new Error('Woop');
    });

    const resolver1 = await send('1');
    const resolver2 = await send('2');

    await expect(async function () {
      await Promise.all([resolver1(), resolver2()]);
    }).rejects.toThrow('Woop');

    await send.finish();
  });
});
