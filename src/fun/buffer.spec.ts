import {Buffer} from "./buffer";
import {describe, expect, it} from "vitest";
import {toArray} from "../toArray";

describe(Buffer.name, () => {

    it('keeps buffer', async function () {

        const b1 = Buffer<number>(4);
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

        expect(b1.length()).toEqual(4);

        setTimeout(() => b1.finish(), 0)
        const numbers = await toArray(b1.stream);

        expect(p4Resolved).toEqual(true)
        expect(b1.length()).toEqual(0);
        expect(numbers).toEqual([1, 2, 3, 4])
    });
})