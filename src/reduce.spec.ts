import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {reduce} from "./reduce";
import {run} from "./index";

describe(reduce.name, () => {
    it('reduce values as stream output', async () => {
        const stream = from([
            1, 2, 3
        ])

            .pipe(
                reduce(async (accumulator, input) => {
                    return {
                        sum: accumulator.sum + input
                    }
                }, {sum: 0})
            )

        const outputs = await toArray(stream);

        expect(outputs).toEqual([{sum: 6}])
    });

    it('reduce values with run helper', async () => {
        const stream = from([
            1, 2, 3
        ])

            .pipe(
                reduce(async (accumulator, input) => {
                    return {
                        sum: accumulator.sum + input
                    }
                }, {sum: 0})
            )

        const lastValue = await run(stream, null);
        expect(lastValue).toEqual({sum: 6})
    });

    it('reduce values with run helper and empty stream', async () => {
        const stream = from([])

            .pipe(
                reduce(async (accumulator, input) => {
                    return {
                        sum: accumulator.sum + input
                    }
                }, {sum: 0})
            )

        const lastValue = await run(stream, null);
        expect(lastValue).toEqual({sum: 0})
    });
})