import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";
import {read, reader} from "./reader";
import {sequence} from "./sequence";
import {of} from "./index";

describe(reader.name, () => {
    it('test', async () => {
        const array = [1, 2]
        const stream = reader<number>(() => {
            const value = array.shift();
            return value || reader.DONE
        });
        expect(await toArray(stream)).toEqual([1, 2])
    });
})

describe(read.name, () => {
    it('test', async () => {
        const stream = of(sequence(3));
        const readStream = read(stream);
        expect(await readStream()).toEqual(0)
        expect(await readStream()).toEqual(1)
        expect(await readStream()).toEqual(2)
        expect(await readStream()).toEqual(read.DONE)
        expect(await readStream()).toEqual(read.DONE)
    });
})