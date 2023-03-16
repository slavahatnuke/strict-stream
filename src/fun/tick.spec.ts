import {tick, tickAsync} from "./tick";
import {Defer} from "./defer";
import {delay} from "./delay";
import {describe, expect, it} from "vitest";

describe(tick.name, () => {

    it('tick', async function () {

        const defer = Defer();
        let ticked = false;

        tick(() => {
            defer.resolve(true)
            ticked = true
        })

        await defer.promise;

        expect(ticked).toEqual(true)
    });


    it('tickAsync', async function () {
        let ticked = false;
        const d1 = Date.now();

        await tickAsync(async () => {
            await delay(200);
            ticked = true
            throw new Error(`woop`)
        })

        const d2 = Date.now();


        expect(Math.round((d2 - d1) / 200)).toEqual(1)
        expect(ticked).toEqual(true)
    });
})