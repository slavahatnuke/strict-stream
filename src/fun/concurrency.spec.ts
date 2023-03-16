import {concurrency} from "./concurrency";
import {delay} from "./delay";
import {tickAsync} from "./tick";
import {describe, expect, it} from "vitest";

describe(concurrency.name, () => {

    it('concurrency / 2', async function () {

        const d1 = Date.now()

        let counter = 0;

        const stop = concurrency(2, async () => {
            counter++;
            await delay(200)
        });

        await tickAsync(async () => {
            await delay(10)
            await stop()
        })

        const d2 = Date.now()

        expect(Math.round((d2 - d1) / 200) === 1).toEqual(true)
        expect(counter).toEqual(2)
    });


    it('concurrency / 1', async function () {

        const d1 = Date.now()
        let counter = 0;
        const stop = concurrency(1, async () => {
            await delay(200)
            counter++
        });

        await tickAsync(async () => {
            await delay(10)
            await stop()
        })

        const d2 = Date.now()

        expect(Math.round((d2 - d1) / 200) === 1).toEqual(true)
        expect(counter).toEqual(1)
    });


    it('concurrency / 20', async function () {

        const d1 = Date.now()

        let counter = 0;

        const stop = concurrency(20, async () => {
            counter++;
            await delay(200)
        });

        await tickAsync(async () => {
            await delay(10)
            await stop()
        })

        const d2 = Date.now()

        expect(Math.round((d2 - d1) / 200) === 1).toEqual(true)
        expect(counter).toEqual(20)
    });
})