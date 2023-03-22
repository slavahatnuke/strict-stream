import {Counter} from "./conter";
import {Defer, IDefer} from "./defer";

export type IStopKeepConcurrency = () => Promise<void>;

export function keepConcurrency(
  quantity: number,
  fn: () => Promise<any>,
): IStopKeepConcurrency {
  const desired = quantity;

  const counter = Counter();
  const unsubscribeCounter = counter.subscribe(handle);

  let stopDefer: undefined | IDefer<void> = undefined;
  let stopping = false;

  function handle() {
    if (stopping) {
      return;
    }

    if (counter.value() < desired) {
      (async () => {
        try {
          counter.increment();
          await fn();
        } finally {
          counter.decrement();
        }
      })();
    }
  }

  handle();

  return async function stop() {
    stopping = true;

    if (stopDefer) {
      await stopDefer.promise;
      return;
    }

    stopDefer = stopDefer || Defer();

    if (counter.value() <= 0) {
      stopDefer?.resolve();
    } else {
      const unsubscribe = counter.subscribe(() => {
        if (counter.value() <= 0) {
          stopDefer?.resolve();
          unsubscribe();
        }
      });
    }

    await stopDefer.promise;
    unsubscribeCounter();
  };
}