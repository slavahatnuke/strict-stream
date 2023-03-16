import {Topic} from "./topic";

export type ICounter = {
    increment: (n?: number) => number,
    decrement: (n?: number) => number,
    value: () => number,
    subscribe: (fn: (value: number) => any) => () => void
    destroy: () => void
}

export function Counter(): ICounter {
    const topic = Topic<number>()
    const {subscribe, publish} = topic

    let counter = 0;

    function increment(n = 1) {
        counter += n;
        publish(counter)
        return counter;
    }

    function decrement(n = 1) {
        counter -= n;
        publish(counter)
        return counter;
    }

    function value() {
        return counter;
    }

    function destroy() {
        counter = 0;
        topic.destroy()
    }

    return {
        increment,
        decrement,
        value,
        subscribe,
        destroy,
    }
}
