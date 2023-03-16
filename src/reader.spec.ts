import {describe, expect, it} from "vitest";
import {toArray} from "./toArray";
import {objectReader} from "./objectReader";


describe(objectReader.name, () => {
    it('test', async () => {
        const array = [{id: 1}, {id: 2}]
        const stream = objectReader(() => array.shift());
        expect(await toArray(stream)).toEqual([{id: 1}, {id: 2}])
    });
})