import {TypedStream} from "./type";

export async function* sequence(size: number): TypedStream<number> {
    for (let i = 0; i < size; i++) {
        yield i;
    }
}