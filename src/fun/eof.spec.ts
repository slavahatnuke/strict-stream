import {EOF, isEOF} from "./eof";
import {describe, expect, it} from "vitest";

describe(isEOF.name, () => {
    it('EOF / end of file', async function () {
        expect(isEOF(EOF)).toEqual(true)
        expect(isEOF({})).toEqual(false)
        expect(isEOF(null)).toEqual(false)
        expect(isEOF(123)).toEqual(false)
    });
})


