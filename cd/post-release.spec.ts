import {from} from "strict-stream/from";
import {sequence} from "strict-stream/sequence";
import {map} from "strict-stream/map";
import {toArray} from "strict-stream/toArray";

import {describe, expect, it} from "vitest";

describe('post-release', () => {
    it('test package.json', async () => {
        const installedVersion = require(`${__dirname}/../node_modules/strict-stream/package.json`);
        const currentVersion = require(`${__dirname}/../package.json`);

        expect(installedVersion.version).toEqual(currentVersion.version)
    });

    it('smoke test', async () => {
        const stream = from(sequence(3))
            .pipe(map((value) => value + 100))


        const outputs = await toArray(stream);

        expect(outputs).toEqual([
            100,
            101,
            102,
        ])
    });
})