import {Defer} from './defer';

export type ISyncTopic<T> = {
    publish: (message: T) => void;
    subscribe: ISubscribeTopic<T>;
};

export type ISubscribeTopic<T> = (
    subscriber: ITopicSubscriber<T>,
) => IUnsubscribeTopic;
export type ITopicPublish<T> = (message: T) => Promise<void>;

export type ITopic<T> = {
    publish: ITopicPublish<T>;
    subscribe: ISubscribeTopic<T>;
};

export type ITopicSubscriber<T> = (message: T) => any;
export type IUnsubscribeTopic = () => void | any;

export function SyncTopic<T>(): ISyncTopic<T> {
    let subscribers: ITopicSubscriber<T>[] = [];

    function subscribe(subscriber: (value: T) => void) {
        subscribers.push(subscriber);
        return () => unsubscribe(subscriber);
    }

    function unsubscribe(subscriber: ITopicSubscriber<T>) {
        subscribers = subscribers.filter((sub) => sub !== subscriber);
    }

    function publish(value: T) {
        subscribers.map((sub) => sub(value));
    }

    return {
        publish,
        subscribe,
    };
}

export class TopicAggregateError extends Error {
    constructor(public errors: Error[], message?: string) {
        super(message);

        const error = errors[0] || ({} as never);

        this.message = message || error.message || '';
        this.stack = error.stack || '';
    }
}

export function Topic<T>({
                             sequent = false,
                             reversed = false,
                         } = {}): ITopic<T> {
    let subscribers: ITopicSubscriber<T>[] = [];

    function subscribe(subscriber: (value: T) => void) {
        subscribers.push(subscriber);
        return () => unsubscribe(subscriber);
    }

    function unsubscribe(subscriber: ITopicSubscriber<T>) {
        subscribers = subscribers.filter((sub) => sub !== subscriber);
    }

    async function publish(message: T) {
        if (sequent) {
            const errors: Error[] = [];

            const subs = reversed ? [...subscribers].reverse() : subscribers;

            for (const sub of subs) {
                try {
                    await sub(message);
                } catch (error) {
                    errors.push(error as Error);
                }
            }

            if (errors.length) {
                if (errors.length === 1) {
                    throw errors[0];
                } else {
                    throw new TopicAggregateError(errors);
                }
            }
        } else {
            await Promise.all(subscribers.map((sub) => sub(message)));
        }
    }

    return {
        publish,
        subscribe,
    };
}

export async function waitForMessage<T>(
    subscribe: ISubscribeTopic<T> | ITopic<T>,
    isAcceptable: (message: T) => boolean | Promise<boolean>,
): Promise<T> {
    const defer = Defer<T>();
    if ('subscribe' in subscribe) {
        subscribe = subscribe.subscribe;
    }

    const unsubscribe = subscribe(async (message: T) => {
        try {
            if (await isAcceptable(message)) {
                unsubscribe();
                defer.resolve(message);
            }
        } catch (error) {
            unsubscribe();
            defer.reject(error as Error);
        }
    });

    return defer.promise;
}
