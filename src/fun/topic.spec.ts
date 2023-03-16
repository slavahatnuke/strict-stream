import {describe, expect, it} from "vitest";
import {Topic} from "./topic";

describe(Topic.name, () => {
    it('topic', async function () {

        const topic = Topic<string>();

        let values: string[] = []

        const unsubscribe = topic.subscribe((value: string) => values.push(value));

        topic.publish('AAA')
        topic.publish('BBB')

        unsubscribe()
        topic.publish('CCC')

        expect(values).toEqual(['AAA', 'BBB'])
    });


    it('topic / destroy', async function () {

        const topic = Topic<string>();

        let values: string[] = []

        const unsubscribe = topic.subscribe((value: string) => values.push(value));

        topic.publish('AAA')
        topic.publish('BBB')

        topic.destroy()
        topic.publish('CCC')

        expect(values).toEqual(['AAA', 'BBB'])
    });


    it('topic / unsubscribe', async function () {

        const topic = Topic<string>();

        let values: string[] = []

        const listener = (value: string) => values.push(value);
        topic.subscribe(listener);

        topic.publish('AAA')
        topic.publish('BBB')

        topic.unsubscribe(listener)
        topic.publish('CCC')

        expect(values).toEqual(['AAA', 'BBB'])
    });
})


