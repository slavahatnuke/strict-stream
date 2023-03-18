import {Counter, ICounter} from './conter';
import {Defer, IDefer} from './defer';
import {waitForCounter} from "./waitForCounter";


export type IConcurrencyResultResolver = () => Promise<any>;
export type IPublishToConcurrency<T> = ((
    message: T,
) => Promise<IConcurrencyResultResolver>) & {
    finish: () => Promise<void>;
    counter: ICounter; // concurrency counter
    quantity: ICounter; // queued quantity
};

export function Concurrency<Input, Output = any>(
    maxConcurrency: number,
    worker: (message: Input) => Promise<Output>,
): IPublishToConcurrency<Input> {
    const max = maxConcurrency;
    const concurrencyCounter = Counter();
    const queuedQuantity = Counter();

    let finishing = false;

    function handle(message: Input, defer: IDefer<any>) {
        concurrencyCounter.increment();

        (async () => {
            try {
                defer.resolve(await worker(message));
            } catch (error) {
                defer.reject(error as Error);
            } finally {
                concurrencyCounter.decrement();
                queuedQuantity.decrement();
            }
        })();
    }

    const canHandle = () => {
        const maximum = max;

        if (!maximum) {
            return true;
        } else {
            return concurrencyCounter.value() < maximum;
        }
    };

    const isEmpty = () => concurrencyCounter.value() <= 0;

    async function tryToHandle(message: Input, defer: IDefer<any>) {
        if (canHandle()) {
            handle(message, defer);
        } else {
            await waitForCounter(concurrencyCounter, canHandle);
            tryToHandle(message, defer);
        }
    }

    const publish = async (message: Input) => {
        // if (finishing) {
        //   throw new Error(`Finishing concurrency, publish is not allowed`);
        // }

        const defer = Defer<any>();
        queuedQuantity.increment();

        await tryToHandle(message, defer);

        return async () => defer.promise;
    };

    publish.counter = concurrencyCounter;
    publish.quantity = queuedQuantity;

    publish.finish = async () => {
        finishing = true;
        await waitForCounter(concurrencyCounter, isEmpty);
        concurrencyCounter.reset();
        finishing = false;
    };

    return publish;
}

