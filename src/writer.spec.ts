import {Writer} from "./writer";
import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";

describe(Writer.name, () => {

    it('keeps buffer', async function () {

        const writer = Writer<number>(4);
        expect(writer.length()).toEqual(0);
        await writer.write(1)
        expect(writer.length()).toEqual(1);
        await writer.write(2)
        expect(writer.length()).toEqual(2);
        await writer.write(3)
        expect(writer.length()).toEqual(3);

        let p4Resolved = false;

        const p4 = writer.write(4);

        p4.then(() => {
            p4Resolved = true;
        })

        expect(p4Resolved).toEqual(false)

        expect(writer.length()).toEqual(4);

        setTimeout(() => writer.finish(), 0)
        const numbers = await toArray(writer.stream);

        expect(p4Resolved).toEqual(true)
        expect(writer.length()).toEqual(0);
        expect(numbers).toEqual([1, 2, 3, 4])
    });
})