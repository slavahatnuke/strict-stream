import {Queue} from "./queue";
import {isEOF} from "./eof";
import {describe, expect, it} from "vitest";

describe(Queue.name, () => {

    it('queue', async function () {
        const queue = Queue<string>();
        const w1 = queue.write('hello1');
        const w2 = queue.write('hello2');
        const w3 = queue.write('hello3');

        expect(queue.length()).toEqual(3)

        const r1 = queue.read();
        expect(queue.length()).toEqual(2)


        const r2 = queue.read();
        expect(queue.length()).toEqual(1)

        const r3 = queue.read();
        expect(queue.length()).toEqual(0)

        const r4 = queue.read();
        expect(queue.length()).toEqual(0)

        setTimeout(() => queue.write('hello4'), 0)

        expect(await r1).toEqual('hello1')
        expect(await r2).toEqual('hello2')
        expect(await r3).toEqual('hello3')
        expect(await r4).toEqual('hello4')
    });


    it('queue / finish', async function () {
        const events: any[] = [];

        const queue = Queue<string>();

        queue.subscribe((event) => {
            events.push(event.type)
        })

        const w1 = queue.write('hello1');
        const w2 = queue.write('hello2');

        const r1 = queue.read();

        const r2 = queue.read();


        expect(await r1).toEqual('hello1')
        expect(await r2).toEqual('hello2')

        await queue.finish();
        await queue.finish();
        await queue.finish();

        expect(events).toEqual(["write", "write", "read", "read", "finish"])

        expect(isEOF(await queue.read())).toEqual(true)
        expect(isEOF(await queue.read())).toEqual(true)
    });


    it('queue / destroy', async function () {
        const events: any[] = [];

        const queue = Queue<string>();

        queue.subscribe((event) => {
            events.push(event.type)
        })

        const w1 = queue.write('hello1');
        const w2 = queue.write('hello2');

        queue.destroy()
        expect(events).toEqual(["write", "write", "destroy", "destroyed"])

        await expect(async () => {
            await w1
        }).rejects.toThrow(`Queue: message is destroyed`)

        await expect(async () => {
            await w2
        }).rejects.toThrow(`Queue: message is destroyed`)

    });


    it('queue / finish & destroy', async function () {
        const events: any[] = [];

        const queue = Queue<string>();

        queue.subscribe((event) => {
            events.push(event.type)
        })

        const w1 = queue.write('hello1');
        const w2 = queue.write('hello2');
        const f1 = queue.finish();

        queue.destroy()

        expect(events).toEqual(["write", "write", "finish", "destroy", "destroyed"])

        await expect(async () => {
            await w1
        }).rejects.toThrow(`Queue: message is destroyed`)

        await expect(async () => {
            await w2
        }).rejects.toThrow(`Queue: message is destroyed`)

        await expect(async () => {
            await f1
        }).rejects.toThrow(`Queue: queue is destroyed`)

    });
})