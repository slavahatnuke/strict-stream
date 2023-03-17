import {Concurrency, IPublishToConcurrency} from "./concurrency";

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
    {workerConcurrency = 1}: Partial<IKeyedConcurrencyOptions> = {},
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