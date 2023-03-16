export type ITopic<T extends any> = {
    publish: (value: T) => void
    subscribe: (listener: (value: T) => any) => () => void
    unsubscribe: (listener: (value: T) => any) => void
    destroy: () => void
}

export type ITopicListener<T extends any> = (value: T) => void;

export function Topic<T extends any>(): ITopic<T> {
    let subscribers: ITopicListener<T>[] = [];

    function subscribe(listener: ITopicListener<T>) {
        subscribers.push(listener)
        return () => unsubscribe(listener)
    }

    function unsubscribe(listener: ITopicListener<T>) {
        subscribers = subscribers.filter((sub) => sub !== listener)
    }

    function publish(value: T) {
        subscribers.map((sub) => sub(value))
    }

    function destroy() {
        subscribers = []
    }

    return {
        subscribe,
        unsubscribe,
        publish,
        destroy,
    }
}
