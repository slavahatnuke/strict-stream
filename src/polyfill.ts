// polyfill
if (!Symbol) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-global-assign
    Symbol = (description: string) => description

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Symbol.for = (key) => key
}

if (!(Symbol as any).asyncIterator) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");
}

if (!Symbol.iterator) {
    (Symbol as any).iterator = Symbol.iterator || Symbol("Symbol.iterator");
}