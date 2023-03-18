import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {map} from "./map";

describe(map.name, () => {
    it('maps values', async () => {

        const inputValues: number[] = [];
        const stream = from([1, 2, 3])
            .pipe(map((value) => {
                inputValues.push(value)
                const outputValue = `${value}-string-value`;
                return outputValue
            }))

        const outputs = await toArray(stream);

        expect(outputs).toEqual(['1-string-value', '2-string-value', '3-string-value'])
        expect(inputValues).toEqual([1, 2, 3])
    });

    it('async way to map values', async () => {

        const inputValues: number[] = [];
        const stream = from([1, 2, 3])
            .pipe(map(async (value) => {
                inputValues.push(value)
                const outputValue = value + 100;

                await new Promise((resolve, reject) => {
                    setTimeout(resolve, 20)
                })

                return outputValue
            }))

        const outputs = await toArray(stream);

        expect(outputs).toEqual([101, 102, 103])
        expect(inputValues).toEqual([1, 2, 3])
    });
})