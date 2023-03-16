import {Queue} from "./queue";
import {queueToArray} from "./queueToArray";
import {describe, expect, it} from "vitest";

describe(queueToArray.name, () => {

    it('queueToArray', async function () {

        const queue = Queue<number>();

        queue.write(1)
        queue.write(2)
        queue.write(3)

        expect(await queueToArray(queue)).toEqual([1,2,3])
    });
})