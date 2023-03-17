import {pipe, Promised, StrictStreamMapper} from "./index";
import {batch} from "./batch";
import {map} from "./map";
import {flat} from "./flat";

export function scaleSync<Input, Output>(size: number, mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output> {
    return pipe(
        batch<Input>(size),
    ).pipe(
        map((values) => Promise.all(values.map(mapper)))
    ).pipe(
        flat()
    );
}