import {Promised, StrictStream} from "./index";
import {Reader} from "./reader";

export function loop(condition: () => Promised<boolean>): StrictStream<true> {
    return Reader<true>(async () => {
        return await condition() ? true : Reader.DONE
    })
}