import {StrictStream} from "./index";

export function concatenate<T1, T2, T3, T4>(stream1: StrictStream<T1>, stream2: StrictStream<T2>, stream3: StrictStream<T3>, stream4: StrictStream<T4>): StrictStream<T1 | T2 | T3 | T4>;
export function concatenate<T1, T2, T3>(stream1: StrictStream<T1>, stream2: StrictStream<T2>, stream3: StrictStream<T3>): StrictStream<T1 | T2 | T3>;
export function concatenate<T1, T2>(stream1: StrictStream<T1>, stream2: StrictStream<T2>): StrictStream<T1 | T2>;
export function concatenate<T>(...streams: StrictStream<any>[]): StrictStream<T> {
    return async function* concatenateStreams(): StrictStream<T> {
        for await (const stream of streams) {
            yield* stream
        }
    }();
}