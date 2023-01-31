import {TypedStream} from "./type";

export async function* sequence(length: number): TypedStream<number> {
    for (let i = 0; i < length; i++) {
        yield i;
    }
}