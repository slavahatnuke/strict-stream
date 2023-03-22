import {describe, expect, it} from "vitest";
import {scaleSync} from "./scaleSync";
import {of} from "./index";
import {sequence} from "./sequence";
import {delay} from "./fun/delay";
import {toArray} from "./toArray";

describe(scaleSync.name, () => {

  it('scaleSync', async function () {
    const d1 = Date.now()

    const out = of(sequence(4))
      .pipe(
        scaleSync(1, async (value) => {
          await delay(100)
          return value
        })
      );

    const outputs = await toArray(out);
    const d2 = Date.now()

    expect(outputs).toEqual([0, 1, 2, 3])
    expect(Math.round((d2 - d1) / 100)).toEqual(4)
  });


  it('scaleSync 2', async function () {
    const d1 = Date.now()
    const out = of(sequence(4))
      .pipe(
        scaleSync(2, async (value) => {
          await delay(100)
          return value
        })
      );

    const outputs = await toArray(out);
    const d2 = Date.now()

    expect(outputs).toEqual([0, 1, 2, 3])
    expect(Math.round((d2 - d1) / 100)).toEqual(2)
  });

  it('scaleSync 4', async function () {
    const d1 = Date.now()
    const out = of(sequence(4))
      .pipe(
        scaleSync(4, async (value) => {
          await delay(100)
          return value
        })
      );

    const outputs = await toArray(out);
    const d2 = Date.now()

    expect(outputs).toEqual([0, 1, 2, 3])
    expect(Math.round((d2 - d1) / 100)).toEqual(1)
  });

  it('scaleSync 3', async function () {
    const d1 = Date.now()

    const out = of(sequence(4))
      .pipe(
        scaleSync(2, async (value) => {
          await delay(100)
          return value
        })
      );

    const outputs = await toArray(out);
    const d2 = Date.now()

    expect(outputs).toEqual([0, 1, 2, 3])
    expect(Math.round((d2 - d1) / 100)).toEqual(2)
  });


  it('scaleSync / error', async function () {
    await expect(async () => {
      const out = of(sequence(4))
        .pipe(
          scaleSync(2, async (value) => {
            await delay(100)
            throw new Error(`Woooppepeeee`)
          })
        );

      await toArray(out)
    }).rejects.toThrow(`Woooppepeeee`)
  });
})