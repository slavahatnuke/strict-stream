import {IQueue, Queue, QUEUE_READ} from "./queue";
import {Defer} from "./defer";

export function Buffer<T extends any>(size: number): IQueue<T> {
    const desired = size
    const queue = Queue<T>();

    async function write(value: T) {
        if (queue.length() < desired) {
            queue.write(value)
        } else {
            const defer = Defer<void>();

            const unsubscribe = queue.subscribe((event) => {
                switch (event.type) {
                    case QUEUE_READ:
                        if (queue.length() < desired) {
                            queue.write(value)
                            defer.resolve()
                            unsubscribe()
                        }

                        break;
                }
            });

            await defer.promise;
        }
    }

    return {
        write,
        read: queue.read,
        length: queue.length,
        subscribe: queue.subscribe,
        finish: queue.finish,
        destroy: queue.destroy,
    }
}
