import { Counter, ICounter } from './conter';
import { Defer, IDefer } from './defer';
import {waitForCounter} from "./waitForCounter";


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

export type IConcurrencyResultResolver = () => Promise<any>;
export type IPublishToConcurrency<T> = ((
  message: T,
) => Promise<IConcurrencyResultResolver>) & {
  finish: () => Promise<void>;
  counter: ICounter; // concurrency counter
  quantity: ICounter; // queued quantity
};

export function Concurrency<T, ReturnType = any>(
  maxConcurrency: number,
  worker: (message: T) => Promise<ReturnType>,
): IPublishToConcurrency<T> {
  const max = maxConcurrency;
  const concurrencyCounter = Counter();
  const queuedQuantity = Counter();

  let finishing = false;

  function handle(message: T, defer: IDefer<any>) {
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

  async function tryToHandle(message: T, defer: IDefer<any>) {
    if (canHandle()) {
      handle(message, defer);
    } else {
      await waitForCounter(concurrencyCounter, canHandle);
      tryToHandle(message, defer);
    }
  }

  const publish = async (message: T) => {
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

type IKeyType = string | number | undefined;
type IGetKey<T> = (message: T) => IKeyType | Promise<IKeyType>;
type IKeyedConcurrencyOptions = {
  workerConcurrency: number;
};

export function KeyedConcurrency<T>(
  maxConcurrency: number,
  getKey: IGetKey<T>,
  worker: (message: T) => Promise<any>,
  // options
  { workerConcurrency = 1 }: Partial<IKeyedConcurrencyOptions> = {},
): IPublishToConcurrency<T> {
  const registry: { [key in string | number]: IPublishToConcurrency<T> } = {};

  return Concurrency<T>(maxConcurrency, async (message: T) => {
    const key = await getKey(message);

    if (key === undefined) {
      return worker(message);
    } else {
      if (!registry[key]) {
        const keyedControl = Concurrency<T>(workerConcurrency, worker);
        registry[key] = keyedControl;

        const unsubscribe = keyedControl.quantity.subscribe((value) => {
          if (value <= 0) {
            unsubscribe();

            if (registry[key]) {
              delete registry[key];
            }
          }
        });
      }

      const resolver = await registry[key]!(message);
      return await resolver();
    }
  });
}
