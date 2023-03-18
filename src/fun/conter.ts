import {ISubscribeTopic, SyncTopic} from './topic';

export type ICounter = {
    increment: (n?: number) => number;
    decrement: (n?: number) => number;
    value: () => number;
    subscribe: ISubscribeTopic<number>;
    reset: () => void;
};

export function Counter(): ICounter {
    const topic = SyncTopic<number>();
    const {subscribe, publish} = topic;

    let counter = 0;

    function increment(n = 1) {
        counter += n;
        publish(counter);
        return counter;
    }

    function decrement(n = 1) {
        counter -= n;
        publish(counter);
        return counter;
    }

    function value() {
        return counter;
    }

    function reset() {
        counter = 0;
        publish(0);
    }

    return {
        increment,
        decrement,
        value,
        subscribe,
        reset,
    };
}
