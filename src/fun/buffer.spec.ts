import {Buffer} from "./buffer";
import {tickAsync} from "./tick";
import {describe, expect, it} from "vitest";

describe(Buffer.name, () => {

    it('keeps buffer', async function () {

        const b1 = Buffer<number>(3);
        expect(b1.length()).toEqual(0);
        await b1.write(1)
        expect(b1.length()).toEqual(1);
        await b1.write(2)
        expect(b1.length()).toEqual(2);
        await b1.write(3)
        expect(b1.length()).toEqual(3);

        let p4Resolved = false;

        const p4 = b1.write(4);

        p4.then(() => {
            p4Resolved = true;
        })

        expect(p4Resolved).toEqual(false)

        expect(b1.length()).toEqual(3);

        await tickAsync(async () => {
            await b1.read()
        })

        expect(p4Resolved).toEqual(true)
        expect(b1.length()).toEqual(3);
    });
})