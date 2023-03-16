import {tick} from "./tick";
import {Counter} from "./conter";
import {Defer, IDefer} from "./defer";

export type IStopConcurrency = () => Promise<void>;

export function concurrency(quantity: number, fn: () => Promise<any>): IStopConcurrency {
    const desired = quantity;

    const counter = Counter();
    counter.subscribe(() => tick(handle))

    let stopDefer: undefined | IDefer<boolean> = undefined;
    let stopping = false;

    function handle() {
        if (stopping) {
            return;
        }

        if (counter.value() < desired) {
            counter.increment()

            tick(async () => {
                try {
                    await fn()
                    counter.decrement()
                } catch {
                    counter.decrement()
                }
            })
        }
    }

    handle();

    return async function stop() {
        if (stopDefer) {
            await stopDefer.promise;
            return;
        }

        stopDefer = stopDefer || Defer<boolean>();
        stopping = true

        if (counter.value() <= 0) {
            stopDefer.resolve(true)
        } else {
            const unsubscribe = counter.subscribe(() => {
                if (counter.value() <= 0) {
                    stopDefer!.resolve(true)
                    unsubscribe()
                }
            });
        }

        await stopDefer.promise;
    }
}
