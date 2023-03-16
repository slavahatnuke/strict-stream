import {Defer} from "./defer";

type ITickRunner = () => any;
type ITickAsyncRunner = () => Promise<any> | any;

export type ITick = (fn: ITickRunner) => void

export function Tick(): ITick {
    if (setImmediate) {
        return (fn: ITickRunner) => {
            setImmediate(fn)
        }
    } else {
        return (fn: ITickRunner) => {
            setTimeout(fn, 0)
        }
    }
}

export const tick = Tick();

export async function tickAsync(fn: ITickAsyncRunner) {
    const defer = Defer<void>();

    tick(async () => {
        try {
            await fn()
            defer.resolve()
        } catch {
            defer.resolve()
        }
    })

    await defer.promise;
}
