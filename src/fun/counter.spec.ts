import {Counter} from "./conter";
import {describe, expect, it} from "vitest";

describe(Counter.name, () => {

    it('counter', async function () {
        const counter = Counter();

        expect(counter.value()).toEqual(0);
        counter.increment()
        counter.increment()
        expect(counter.value()).toEqual(2);

        counter.decrement()
        expect(counter.value()).toEqual(1);

        counter.increment(10)
        expect(counter.value()).toEqual(11);

        counter.decrement(2)
        expect(counter.value()).toEqual(9);
    });


    it('counter / pubsub', async function () {
        const counter = Counter();

        const values: number[] = []
        counter.subscribe((cnt) => values.push(cnt))

        expect(counter.value()).toEqual(0);
        counter.increment()
        counter.increment()
        expect(counter.value()).toEqual(2);

        counter.decrement()
        expect(counter.value()).toEqual(1);

        counter.increment(10)
        expect(counter.value()).toEqual(11);

        counter.decrement(2)
        expect(counter.value()).toEqual(9);
        expect(values).toEqual([1, 2, 1, 11, 9]);

        counter.destroy()

        expect(values).toEqual([1, 2, 1, 11, 9]);
        expect(counter.value()).toEqual(0);

        counter.increment(100);
        expect(counter.value()).toEqual(100);
        expect(values).toEqual([1, 2, 1, 11, 9]);
    });
})