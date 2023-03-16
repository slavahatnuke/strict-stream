import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {map} from "./map";
import {pipe} from "./index";

describe(pipe.name, () => {
    it('compose part of the stream', async () => {
        const addFive = pipe(
            map((input: number) => input + 4)
        )
            .pipe(map((input) => input + 1))

        const stream = from([
            1, 2, 3
        ])

            .pipe(
                addFive
            )
            .pipe(map((value) => value + 100))


        const outputs = await toArray(stream);

        expect(outputs).toEqual([106, 107, 108])
    });
})