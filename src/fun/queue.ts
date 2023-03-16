import {Topic} from "./topic";
import {Defer, IDefer} from "./defer";
import {EOF, IamEOF} from "./eof";

export type IQueueEvent<T extends any> = {
    type: string,
    payload?: T
}

export type IQueueListener<T extends any> = (event: IQueueEvent<T>) => Promise<void> | void;

export type IQueue<T extends any> = {
    write: (value: T) => Promise<void>,
    read: () => Promise<T | IamEOF>
    subscribe: (listener: IQueueListener<any>) => () => void
    length: () => number
    finish: () => Promise<void>
    destroy: () => void
}

export const QUEUE_WRITE = 'write';
export const QUEUE_READ = 'read';
export const QUEUE_FINISH = 'finish';
export const QUEUE_FINISHED = 'finished';
export const QUEUE_DESTROY = 'destroy';
export const QUEUE_DESTROYED = 'destroyed';

export function Queue<T extends any>(): IQueue<T> {

    const topic = Topic<IQueueEvent<any>>();
    const {publish, subscribe} = topic;

    let messages: { value: T, defer: IDefer<void> }[] = [];
    let finishing = false;
    let finished = false;
    let finishDefer: undefined | IDefer<void> = undefined;

    async function read(): Promise<T | IamEOF> {
        const message = messages.shift();

        if (message) {
            message.defer.resolve()

            publish({
                type: QUEUE_READ,
                payload: message
            })

            return message.value;
        } else {
            if (finishing) {
                _doFinish();
                return EOF;
            }

            const readDefer = Defer<T | IamEOF>();

            const unsubscribe = subscribe((event) => {
                switch (event.type) {
                    case QUEUE_WRITE:
                        const message = messages.shift()

                        if (message) {
                            message.defer.resolve()

                            publish({
                                type: QUEUE_READ,
                                payload: message
                            })

                            readDefer.resolve(message.value)
                            unsubscribe()
                        }
                        break;

                    case QUEUE_DESTROY:
                    case QUEUE_FINISH:
                        readDefer.resolve(EOF)
                        unsubscribe()
                        _doFinish();
                        break;
                }
            });

            return readDefer.promise;
        }
    }

    async function write(value: T): Promise<void> {
        if (finishing) {
            throw new Error(`Finishing, impossible to write`)
        }

        const defer = Defer<void>();
        const message = {value, defer};
        messages.push(message);

        publish({
            type: QUEUE_WRITE,
            payload: message
        })

        await defer.promise
    }


    async function finish() {
        if (finishDefer) {
            await finishDefer.promise;
            return;
        }

        finishDefer = finishDefer || Defer<void>();
        finishing = true;

        if (!messages.length) {
            finishDefer.resolve()
        } else {
            const unsubscribe = subscribe((event) => {
                switch (event.type) {
                    case QUEUE_FINISHED:
                        finishDefer!.resolve()
                        unsubscribe();
                        break;
                    case QUEUE_DESTROY:
                        finishDefer!.reject(new Error(`Queue: queue is destroyed`))
                        unsubscribe();
                        break;
                }
            });
        }

        publish({
            type: QUEUE_FINISH
        })

        await finishDefer.promise
    }

    function destroy() {
        publish({
            type: QUEUE_DESTROY
        })

        messages.forEach((message) => message.defer.reject(new Error(`Queue: message is destroyed`)))
        messages = [];

        finishing = true;
        finished = true;

        publish({
            type: QUEUE_DESTROYED
        })

        topic.destroy()
    }

    function _doFinish() {
        if (!finished) {
            finished = true
            publish({
                type: QUEUE_FINISHED
            })
        }
    }

    function length() {
        return messages.length
    }


    return {
        read,
        write,
        subscribe,
        length,
        finish,
        destroy,
    }
}
