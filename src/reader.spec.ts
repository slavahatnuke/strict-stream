import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";
import {Read, Reader} from "./reader";
import {sequence} from "./sequence";
import {of} from "./index";
import {readdir} from "fs/promises";

describe(Reader.name, () => {
    it('test', async () => {
        const array = [1, 2]
        const stream = Reader<number>(() => {
            const value = array.shift();
            return value || Reader.DONE
        });
        expect(await toArray(stream)).toEqual([1, 2])
    });
})

describe(Read.name, () => {
    it('test', async () => {
        const stream = of(sequence(3));
        const read = Read(stream);
        expect(await read()).toEqual(0)
        expect(await read()).toEqual(1)
        expect(await read()).toEqual(2)
        expect(await read()).toEqual(Read.DONE)
        expect(await read()).toEqual(Read.DONE)
    });
})