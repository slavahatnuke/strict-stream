import {sequence} from "./sequence";
import {map} from "./map";
import {tap} from "./tap";
import {filter} from "./filter";
import {batch} from "./batch";
import {flat} from "./flat";
import {pull, run} from "./index";
import {from} from "./from";

export async function app() {
    let idx = 0;
    const x = from(sequence(5))
        .pipe(map((x) => x + 10))
        .pipe(tap((x) => console.log(x)))
        .pipe(filter((x) => x > 1))
        .pipe(map((a): { name: string } => ({name: String(a)})))
        .pipe(map((x) => ({...x, ok: true})))
        .pipe(tap((x) => console.log(x)))
        .pipe(batch(2))
        .pipe(tap((x) => console.log(x)))
        .pipe(flat())
        .pipe(map((x) => [x, x, x]))
        .pipe(flat())
        .pipe(tap((x) => {
            console.log('>>>', x)
            idx++;
            if (idx % 100000 === 0) {
                console.log(x)
            }
        }));

    const last = await pull(x);
}


app().catch(console.error)