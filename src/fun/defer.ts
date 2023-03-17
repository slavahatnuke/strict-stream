export type IDefer<T> = { promise: Promise<T>, resolve: (value: T) => any, reject: (error: Error) => any };

export function Defer<T>(): IDefer<T> {
    const defer: IDefer<T> = {
        promise: null as any as IDefer<T>['promise'],
        resolve: null as any as IDefer<T>['resolve'],
        reject: null as any as IDefer<T>['reject']
    }

    defer.promise = new Promise<T>((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
}

