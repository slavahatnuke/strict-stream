import {describe, expect, it} from "vitest";
import {nodeWritable} from "./nodeWritable";
import {Writable} from "stream";
import {from} from "./from";
import {toArray} from "./toArray";

describe(nodeWritable.name, () => {
    it('writes', async () => {
        const written: { chunk: any }[] = []
        const myWritable = new Writable({
            write(chunk, encoding: BufferEncoding, callback) {
                written.push({chunk})
                callback()
            },
        });

        const buffer = Buffer.from([100, 101, 102]);
        const stream = from([buffer])
            .pipe(nodeWritable(myWritable));

        const outputs = await toArray(stream);

        expect(written).toEqual([{chunk: buffer}])
        expect(outputs).toEqual([buffer])
    });

    it('error case', async () => {
        const myWritable = new Writable({
            write(chunk, encoding: BufferEncoding, callback) {
                callback(new Error('woops'))
            },
        });

        const buffer = Buffer.from([100, 101, 102]);
        const stream = from([buffer])
            .pipe(nodeWritable(myWritable));

        await expect(async () => {
            await toArray(stream);
        }).rejects.toThrow('woops')
    });
})