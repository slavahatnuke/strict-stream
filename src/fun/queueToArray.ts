import {IQueue} from "./queue";
import {tickAsync} from "./tick";
import {isEOF} from "./eof";

export async function queueToArray<T extends any>(queue: IQueue<T>): Promise<T[]> {
    const values: T[] = [];

    const finishPromise = tickAsync(async () => {
        await queue.finish()
    });

    while (true) {
        if(!queue.length()) {
            break;
        }
        const value = await queue.read();

        if(isEOF(value)) {
            break;
        }

        values.push(value)
    }

    await finishPromise;

    return values;
}
