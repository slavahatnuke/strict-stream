import {sequence} from "./sequence";
import {map} from "./map";
import {tap} from "./tap";
import {batch} from "./batch";
import {flat} from "./flat";
import {pipe, run} from "./index";
import {from} from "./from";

export async function exampleRun() {
    let idx = 0;

    const composedMapper = pipe(
        map((x: number) => String(x))
    )
        .pipe(map((x) => String(x)))
        .pipe(map((x) => parseInt(x)))
        .pipe(map((x) => 200 + x))
        .pipe(map((x) => String(x)))
    // .pipe(map((x) => ({name: x})))

    const x = from(sequence(5))
        .pipe(map((x) => x + 10))
        .pipe(tap((x) => console.log(x)))
        // .pipe(map(String))
        .pipe(
            composedMapper
        )
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

    const last = await run(x);
}


exampleRun().catch(console.error);