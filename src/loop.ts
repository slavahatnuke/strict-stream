import {Promised, StrictStream} from "./index";
import {reader} from "./reader";

export function loop(condition: () => Promised<boolean>): StrictStream<true> {
    return reader<true>(async () => {
        return await condition() ? true : reader.DONE
    })
}