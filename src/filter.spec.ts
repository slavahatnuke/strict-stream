import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {filter} from "./filter";

describe(filter.name, () => {
    it('filter values', async () => {
        const stream = from([
            1, 2, 3
        ])

            .pipe(
                filter((input) => input > 2)
            )

        const outputs = await toArray(stream);

        expect(outputs).toEqual([3])
    });
})