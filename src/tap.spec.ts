import {describe, test, it, expect} from "vitest";
import {tap} from "./tap";

describe(tap.name, () => {
    it('ok', async () => {
        expect(true).toEqual(true)
    });
})