strict-stream
=============
[![CI](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml/badge.svg)](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml?branch=master) [![CD](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml/badge.svg)](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml?branch=master)


`strict-stream` is a tiny and lightweight library that helps manage strictly/strongly typed streams using `AsyncIterable<Type>` as the core principle to enable strict data pipelines with useful behavior.  

It ensures that the data flowing through a stream conforms to a specific data type or structure, which helps catch errors early on, reduce bugs, and make code more reliable and easier to maintain.

Why `Iterable<T>` and `AsyncIterable<T>` Matter
-----------------------------------------------

In JavaScript and TypeScript, `Iterable<T>` and `AsyncIterable<T>` are two important interfaces that allow you to work with sequences of values. 

An `Iterable<T>` is an object that can be iterated over using a `for...of` loop or the `Spread` operator, while an `AsyncIterable<T>` represents a sequence of values that are produced asynchronously, such as through a network request or database query.

Using these interfaces has several advantages:

*   **Type safety:** By using `Iterable<T>` and `AsyncIterable<T>`, you can ensure that the data you're working with is strongly typed and conforms to a specific schema. This helps catch errors early in the development process and makes your code more robust and reliable.

*   **Composability:** Because `Iterable<T>` and `AsyncIterable<T>` are composable, you can easily create complex data pipelines that process, transform, and filter data in a modular way. This makes it easier to reason about your code and maintain it over time.

*   **Performance:** `Iterable<T>` and `AsyncIterable<T>` are highly optimized for performance, allowing you to process data streams with high throughput up to millions of records per second. This makes them an ideal choice for working with large datasets or real-time data streams.


For more information on `Iterable<T>` and `AsyncIterable<T>`, check out the following links:

*   [MDN web docs: Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)
*   [MDN web docs: AsyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)

Installation
------------

To install `strict-stream`, you can use your preferred package manager:

`npm install strict-stream`

or

`yarn add strict-stream`

Usage
-----

Here's a simple example that demonstrates how to use `strict-stream`:

```typescript
import {of} from 'strict-stream';

async function* generateData() {
  yield {name: 'Alice', age: 30};
  yield {name: 'Bob', age: 40};
  yield {name: 'Charlie', age: 50};
}

async function example() {
  // const stream: AsyncIterable<{name: string, age: number}>
  const stream = of(generateData())
    .pipe(filter(({age}) => age > 30));

  for await (const data of stream) {
    console.log(`Name: ${data.name}, Age: ${data.age}`);
  }
  // Name: Bob, Age: 40
  // Name: Charlie, Age: 50
}

await example();
````  
- This code demonstrates how to use the `of` and `filter` functions from the library to create a typed stream and filter the data.
- First, the `generateData` function is an `async generator` function that yields objects with a `name` and `age` property.
- Next, the of function is used to create a `typed stream` from the generator function `generateData`. The resulting stream is an `AsyncIterable` of objects with a `name` and `age` property.
- The `pipe` method is then used to apply a `filter` to the `stream`, keeping only the objects where the `age` property is `greater` than `30`.
- Finally, the resulting stream is iterated over using a `for-await-of` loop. The output shows only the objects where `age` is `greater` than `30`.

### A quick look at transformations

```typescript
import {sequence} from "strict-stream/sequence";
import {map} from "strict-stream/map";
import {from} from "strict-stream/from";
import {filter} from "strict-stream/filter";

async function example() {
  
  const usersStream =
    from(
      // gives sequence 0,1,2,3,4; 
      // sequence is AsyncIterable<number>
      sequence(5)
    )
      .pipe(
        // takes only 0, 2, 4
        filter((id) => id % 2 === 0)
      )
      .pipe(
        // maps to {type: string, id: number, name: string}
        map((id) => ({type: 'User', id, name: `User ${id}`}))
      )

  // usersStream is AsyncIterable<{type: string, id: number, name: string}>
  for await (const user of usersStream) {
    console.log(user)
  }

  // { type: 'User', id: 0, name: 'User 0' }
  // { type: 'User', id: 2, name: 'User 2' }
  // { type: 'User', id: 4, name: 'User 4' }
}
```

1. There is a `sequence` function that generates a sequence of numbers 0,1,2,3,4. 
2. This sequence is filtered using the `filter` function to include only the even numbers (i.e., 0, 2, and 4). 
3. And the resulting sequence is mapped using the `map` function to convert each number into a `user object` with a `type`, `name` and `id`. 
4. Finally `userStreams` is a strictly typed `AsyncIterable<{type: string, id: number, name: string}>`

### How to make a stream with AsyncGenerator?

An example of how to create a stream / `AsyncIterable` with a generator:

```typescript
async function* generateData() {
  yield {name: 'Alice', age: 30};
  yield {name: 'Bob', age: 40};
  yield {name: 'Charlie', age: 50};
}

async function example() {
  const stream = generateData();

  for await (const data of stream) {
    console.log(`Name: ${data.name}, Age: ${data.age}`);
  }
  // Name: Alice, Age: 30
  // Name: Bob, Age: 40
  // Name: Charlie, Age: 50
}

await example();
```

- In this example, `generateData` is a generator function that yields three objects with `name` and `age` properties.
- The `example` function creates a stream from the generator by simply calling it and assigns it to the `stream` variable. 
- Then, it iterates over the stream using a `for await...of` loop and logs the `name` and `age` properties of each object. 


### How to make a stream with reader?

`reader` function which creates an async iterable stream from a reader function. 

The reader function is called every time a new value is requested from the stream and should return the value or DONE if there are no more values.

```typescript
import { reader } from 'strict-stream/reader';

async function example() {
  const array = [1, 2, 3];
  
  const stream = reader<number>(() => {
    const value = array.shift();
    return value === undefined ? reader.DONE : value;
  });

  for await (const number of stream) {
    console.log(number);
  }
  // Output: 1
  // Output: 2
  // Output: 3
}

await example();
```

- In this example, the reader function is called with a generator function that pops a value from the array on each call. 
- When there are no more values, it returns `reader.DONE`, which signals to the stream that there are no more values to yield. 
- Finally, the for `await...of` loop is used to consume the values from the `stream`.

### How to transform a stream?

```typescript
import {reader} from 'strict-stream/reader';
import {map} from 'strict-stream/map';

async function example() {
  const array = [1, 2, 3];

  const stream = reader<number>(() => {
    const value = array.shift();
    return value !== undefined ? value : reader.DONE;
  });

  const transformedStream = of(stream)
    .pipe(
      map((value) => value * 2)
    );

  for await (const value of transformedStream) {
    console.log(value);
  }
  // Output: 2, 4, 6
}

await example();
```

- In this example, the function passed to reader returns the next value in the array each time it is called, using `array.shift()`. 
- If there are no more values in the array, it returns the special `reader.DONE` value to indicate that the stream is complete.
- The `of` function is then used to create a `composable` stream from the `AsyncIterable` returned by `reader`. 
- This stream has a `pipe` method that can be used to apply a `series of transformations` to the `stream`.
- The `map` operator is used to `transform` the stream by multiplying each value by `2`. 
- The `map` operator takes a function that is applied to `each value in the stream`, and returns a `new stream with the transformed values`.
- Finally, the transformed stream is iterated over using a for `await...of` loop. 
- In this case, the output will be `2, 4, 6` which are the values of the original array multiplied by `2`.

## API

### `of<Type>(inputStream: StrictStream<Type>): StrictStreamOf<Type>`
- `of` is a factory function that creates a new instance of a composable stream by wrapping an `AsyncIterable` 
- The resulting stream can be composed with other stream functions using the `pipe` method. 

#### An example:

```typescript
import {of} from "strict-stream";
import {map} from "strict-stream/map";

async function* generateIds() {
  yield 1
  yield 2
  yield 3
}

async function example() {
  const stream = of(generateIds())
    .pipe(
      map(async (id) => ({id, name: `User ${id}`}))
    );

  for await (const data of stream) {
    console.log(`Id: ${data.id}, Name: ${data.name}`);
  }
  // Id: 1, Name: User 1
  // Id: 2, Name: User 2
  // Id: 3, Name: User 3
}

await example();
```

- The code above is a simple to create and `transform` streams of data.
- The `generateIds` function is a generator that yields three numbers (1, 2, and 3) in sequence.
- The `of` function is used to create a stream from the generator by passing `generateIds` as its argument.
- The `pipe` method is used to apply a transformation to the stream. 
- In this case, the `map` function is used to transform each item in the stream. 
- The `map` function takes a callback that is called with each item in the stream, and returns a new value for that item. 
- In this case, the callback takes an `id` value and returns an object with two properties: `id` and `name`.
- Finally, the transformed stream is consumed with a `for-await-of` loop, which iterates through each item in the stream and logs its id and name properties to the console. 
- The output will be `Id: 1, Name: User 1`, `Id: 2, Name: User 2`, and `Id: 3, Name: User 3`.

#### An example (advanced, custom mapper):

```typescript
import {of, StrictStreamMapper} from "strict-stream";

async function* generateIds() {
  yield 1
  yield 2
  yield 3
}

async function example() {

  // my first stream mapper; maps inputStream to mappedStream;
  function myMap<Input, Output>(mapper: (input: Input) => Promise<Output>): StrictStreamMapper<Input, Output> {
    // receives inputStream
    return (inputStream) => {
      return (
        async function* () {
          // reads input stream
          for await (const record of inputStream) {
            // map values
            yield await mapper(record)
          }
        }
      )()
    };
  }

  const stream = of(generateIds())
    .pipe(
      myMap(async (id) => ({id, name: `User ${id}`}))
    );

  for await (const data of stream) {
    console.log(`Id: ${data.id}, Name: ${data.name}`);
  }
  // Id: 1, Name: User 1
  // Id: 2, Name: User 2
  // Id: 3, Name: User 3
}

await example();
```

- `of` creates a new stream instance from the `generateIds` async generator. 
- the resulting stream is composed with the `myMap` function that transforms each `id` into an object with `id` and `name` properties. 
- finally, the transformed stream is iterated using a `for await...of` loop.

### `tap<Input>(fn: (input: Input) => Promised<any>): StrictStreamMapper<Input, Input>`
`tap` is a utility function that allows you to perform `side-effects` on each element of a stream without modifying the stream itself. 

It works by taking a callback function as an argument, which is invoked for each element of the stream, 

but then simply returns the original element, so that it can be passed on to the next step in the pipeline unchanged.

#### An example:

```typescript
import {of} from "strict-stream";
import {tap} from "strict-stream/tap";

async function example() {
  async function* generateIds() {
    yield 1
    yield 2
    yield 3
  }

  const transformedStream = of(generateIds())
    .pipe(
      tap((value) => console.log(value))
    );

  for await (const value of transformedStream) {
    /* empty */
  }
  // 1
  // 2
  // 3
}

await example();
```

- In this example, we start with an asynchronous generator that yields three numbers: 1, 2, and 3. 
- We then use the `of` function to wrap this generator in a composable stream, and then use the `pipe` method to apply the `tap` function to the stream. 
- The `tap` function simply logs each element of the stream to the console.
- Finally, we iterate over the transformed stream using a `for-await-of` loop, which triggers the evaluation of the stream and executes the `side-effects` of the `tap` function. 
- However, since tap returns each element unchanged, the loop does not actually output anything to the console.
- The output of the example, therefore, is simply the values 1, 2, and 3, printed to the console by the tap function.

### `run<Type, Default = undefined>(stream: StrictStream<Type>, defaultValue?: Default): Promise<Type | Default>`
- Consumes the given `AsyncIterable`, iterating over its values, and returns a Promise that resolves to the `last value` of the `stream`.
- If the `stream` is empty, the function returns a `default value`, which is optional and defaults to `undefined`.

#### An example

```typescript
import {of, run} from "strict-stream";
import {tap} from "strict-stream/tap";

async function example() {
  async function* generateIds() {
    yield 1
    yield 2
    yield 3
  }

  const stream = of(generateIds())
    .pipe(
      tap(console.log)
    );

  await run(stream)
  // Output
  // 1
  // 2
  // 3
}

await example();
```

- It then creates a stream by calling of with `generateIds` as its argument. It then pipes this stream through a tap operation which logs each value emitted by the stream to the console.
- Finally, it calls the run function to execute the stream. The run function returns a Promise that resolves when the stream has completed. 
- In this case, it logs the numbers 1, 2, and 3 to the console.

### `sequence(length: number): StrictStream<number>`

#### An example

```typescript
import {of, run} from "strict-stream";
import {tap} from "strict-stream/tap";
import {sequence} from "strict-stream/sequence";

async function example() {
  const sequenceStream = of(sequence(3))
    .pipe(
      tap(console.log)
    );

  await run(sequenceStream)
  // 0
  // 1
  // 2
}

await example();
```

- The code is an example of how to use the `sequence` function to generate a stream of numbers with a `given length`
- And then use the of and `pipe` functions to `transform` the `stream` by appending a `tap` function that `logs each value` in the `stream` to the `console`.
- Specifically, the `sequence` function generates a `stream of numbers` from `0 up to the given length`. 
- The of function is then used to create a new stream from the output of the `sequence` function, and the `pipe` method is called to add the `tap` function as a transform to the stream. 
- Finally, the `run` function is called to consume the `stream` and `log each value` to the console.

When the example function is called 
- It creates a new stream using `of(sequence(3))`, which generates a stream of numbers from `0 to 2`. 
- The `pipe` method is then used to append a `tap` function that `logs each value` in the `stream` to the console. 
- Finally, the `run` function is called to consume the stream and log each value to the console. 
- The output is: 1, 2, 3

### `pipe<In, Out>(mapper: StrictStreamMapper<In, Out>): StrictStreamPlumber<In, Out>`

- Returns a function that is a mapper from `In` to `Out`, and is also extended with a `pipe()` method that allows for chaining mappers together.
- A `StrictStreamMapper` is a function that takes a `StrictStream` of type `In` and returns a new `StrictStream` of type `Out`.
- A `StrictStreamPlumber` is a type of `StrictStreamMapper` that is extended with the `pipe()` method.


License
-------

`strict-stream` is licensed under the **MIT License**.
