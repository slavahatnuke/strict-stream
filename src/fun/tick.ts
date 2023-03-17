import {Defer} from './defer';

type ITickSyncRunner = () => any;
type ITickRunner = () => Promise<any> | any;

export type ITick = (fn: ITickSyncRunner) => void;

export function SyncTick(): ITick {
    if (setImmediate instanceof Function) {
        return (fn: ITickSyncRunner) => {
            setImmediate(fn);
        };
    } else {
        return (fn: ITickSyncRunner) => {
            setTimeout(fn, 0);
        };
    }
}

export const syncTick = SyncTick();

export async function tick(fn: ITickRunner) {
    const defer = Defer<void>();

    syncTick(async () => {
        try {
            await fn();
            defer.resolve();
        } catch (error) {
            defer.reject(error as Error);
        }
    });

    await defer.promise;
}
