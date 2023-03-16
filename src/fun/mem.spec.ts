import {mem} from "./mem";
import {describe, expect, it} from "vitest";

describe(mem.name, () => {
    it('mem', function () {

        let counter = 0;
        const m = mem(() => {
            counter++
            return counter + 10
        });
        m()
        m()
        m()
        const val = m();
        expect(counter).toEqual(1)
        expect(val).toEqual(11)
    });
})

