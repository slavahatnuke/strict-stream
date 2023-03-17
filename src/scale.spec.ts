import {describe, expect, it} from "vitest";
import {scale} from "./scale";
import {sequence} from "./sequence";
import {delay} from "./fun/delay";
import {of} from "./index";
import {toArray} from "./toArray";
import {tap} from "./tap";

describe(scale.name, () => {

    it('scale', async function () {
        const d1 = Date.now()
        const out = of(sequence(4))
            .pipe(
                scale(1, async (value) => {
                    await delay(100)
                    return value
                })
            );

        const outputs = await toArray(out);
        const d2 = Date.now()


        expect(outputs.sort()).toEqual([0, 1, 2, 3])
        expect(Math.round((d2 - d1) / 100)).toEqual(4)
    });


    it('scale 2', async function () {

        const d1 = Date.now()
        const out = of(sequence(4))
            .pipe(
                scale(2, async (value) => {
                    await delay(100)
                    return value
                })
            );
        const outputs = await toArray(out);

        const d2 = Date.now()

        expect(outputs.sort()).toEqual([0, 1, 2, 3])
        expect(Math.round((d2 - d1) / 100)).toEqual(2)
    });

    it('scale 4', async function () {
        const d1 = Date.now()

        const out = of(sequence(4))
            .pipe(
                scale(4, async (value) => {
                    await delay(100)
                    return value
                })
            );
        const outputs = await toArray(out);

        const d2 = Date.now()

        expect(outputs.sort()).toEqual([0, 1, 2, 3])
        expect(Math.round((d2 - d1) / 100)).toEqual(1)
    });

    it('scale 3', async function () {
        const d1 = Date.now()

        const out = of(sequence(4))
            .pipe(
                scale(3, async (value) => {
                    await delay(100)
                    return value
                })
            );
        const outputs = await toArray(out);

        const d2 = Date.now()

        expect(outputs.sort()).toEqual([0, 1, 2, 3])
        expect(Math.round((d2 - d1) / 100)).toEqual(2)
    });

    it('scale / error', async function () {
        await expect(async () => {
            const out = of(sequence(4))
                .pipe(
                    scale(4, async (value) => {
                        await delay(100)
                        throw new Error(`Woops`)
                    })
                );

            await toArray(out);
        }).rejects.toThrow(`Woops`)
    });

    it('scale / source / error', async function () {
        await expect(async () => {
            const out = of(sequence(4))
                .pipe(tap(() => {
                    throw new Error('Source Error')
                }))
                .pipe(
                    scale<number, number>(4, async (value) => {
                        throw new Error(`Unexpected error`)
                        return value
                    }),
                );

            await toArray(out);
        }).rejects.toThrow(`Source Error`)
    });
})