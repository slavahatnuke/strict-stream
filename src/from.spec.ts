import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {map} from "./map";
import {sequence} from "./sequence";

describe(from.name, () => {
    it('maps pipeable stream from array', async () => {
        const stream = from([1, 2, 3])
            .pipe(map((value) => value + 1000))
            .pipe(map((value) => value + 100))
            .pipe(map(String))


        const outputs = await toArray(stream);

        expect(outputs).toEqual(['1101', '1102', '1103'])
    });

    it('maps pipeable stream from stream', async () => {
        type IUser = { id: number, name: string }
        const stream = from(sequence(3))
            .pipe(map(async (value): Promise<IUser> => {
                return {id: value, name: `Name ${value}`}
            }))
            .pipe(map((user) => user.name))


        const outputs = await toArray(stream);

        expect(outputs).toEqual(['Name 0', 'Name 1', 'Name 2'])
    });


    it('throws an error if can not create a stream', async () => {
        expect(() => {
            from(null as any)
        }).toThrow('object, is not iterable')

        expect(() => {
            from(true as any)
        }).toThrow('boolean, is not iterable')

        expect(() => {
            from(123 as any)
        }).toThrow('number, is not iterable')

        expect(() => {
            from('abc' as any)
        }).toThrow('string, is not iterable')

        expect(() => {
            from(undefined as any)
        }).toThrow('undefined, is not iterable')
    });
})