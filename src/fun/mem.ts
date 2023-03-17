export function mem<T extends any>(fn: () => T): () => T {
    let value: any = undefined;
    let called = false;

    return () => {
        if (called) {
            return value;
        }

        called = true;
        value = fn();
        return value
    }
}
