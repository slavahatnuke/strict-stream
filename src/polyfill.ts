// polyfill
if (!Symbol) {
    // @ts-ignore
    Symbol = (description: string) => description

    // @ts-ignore
    Symbol.for = (key) => key
}

if (!(Symbol as any).asyncIterator) {
    // @ts-ignore
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");
}

if (!Symbol.iterator) {
    (Symbol as any).iterator = Symbol.iterator || Symbol("Symbol.iterator");
}