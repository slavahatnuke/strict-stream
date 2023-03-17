import {describe, expect, it} from "vitest";
import {merge} from "./merge";
import {from} from "./from";
import {toArray} from "./toArray";

describe(merge.name, () => {
    it('test', async () => {
        const usersV1Stream = from([{type: 'userV1', name: 'User Name'}]);
        const usersV2Stream = from([{type: 'userV2', firstName: 'User', lastName: 'Name'}]);
        const usersStream = merge(usersV1Stream, usersV2Stream);

        expect(await toArray(usersStream)).toEqual([
            {type: 'userV1', name: 'User Name'},
            {type: 'userV2', firstName: 'User', lastName: 'Name'}
        ])
    });
})