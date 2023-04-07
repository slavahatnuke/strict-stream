# strict-stream
[![CI](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/slavahatnuke/strict-stream/actions/workflows/ci.yml?branch=master) [![CD](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml/badge.svg?branch=master)](https://github.com/slavahatnuke/strict-stream/actions/workflows/cd.yml?branch=master)

`strict-stream` is a tiny and lightweight library that helps manage `strictly/strongly typed streams` using `AsyncIterable<Type>` as the core principle to enable strict data pipelines with useful behavior.  

It ensures that the data flowing through a stream conforms to a specific data type or structure, which helps catch errors early on, reduce bugs, and make code more reliable and easier to maintain.

Why `Iterable<T>` and `AsyncIterable<T>` Matter
-----------------------------------------------

In `JavaScript` and `TypeScript`, `Iterable<T>` and `AsyncIterable<T>` are two important interfaces that allow you to work with sequences of values. 

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
import {filter} from 'strict-stream/filter';

async function* generateData() {
  yield {name: 'Alice', age: 30};
  yield {name: 'Bob', age: 40};
  yield {name: 'Charlie', age: 50};
}

async function example() {
  // AsyncIterable<{name: string, age: number}>
  const stream = of(generateData())
    .pipe(
      filter(({age}) => age > 30)
    );

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


### Inferred types and IDE hints

![strict stream usage](https://user-images.githubusercontent.com/302592/227898570-3a120a82-3bf7-4cef-9c5f-8dd1746ade91.gif)

### A quick look at transformations

```typescript
import {sequence} from "strict-stream/sequence";
import {map} from "strict-stream/map";
import {from} from "strict-stream/from";
import {filter} from "strict-stream/filter";

async function example() {
  
  const usersStream =
    from(
      // gives AsyncIterable<number> 
      // sequence 0,1,2,3,4; 
      sequence(5)
    )
      .pipe(
        // takes only 0, 2, 4
        filter((id) => id % 2 === 0)
      )
      .pipe(
        // maps to {type: string, id: number, name: string}
        map((id) => ({
          type: 'User', 
          id, 
          name: `User ${id}`
        }))
      )

  // inferred type
  // AsyncIterable<{type: string, id: number, name: string}>
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

  const stream = reader<number>(async () => {
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

### `from<Input>(streamLike: StrictStreamLike<Input>): StrictStreamOf<Input>`

The `from` function is used to convert any `iterable` object, whether `synchronous` or `asynchronous`, to a `StrictStream`.

It takes a single argument of type `StrictStreamLike<Input>`, which can be either an `Iterable` or an `AsyncIterable`;

The `from` function returns a `StrictStream` object of type `StrictStreamOf<Input>`, which has a `pipe` method that can be used to transform the `stream`.

`StrictStreamLike<Type>` type means `AsyncIterable<Type> | Iterable<Type> | Type[]`

#### An example

```typescript
import {from} from "strict-stream/from";
import {map} from "strict-stream/map";

async function* generateIds() {
  yield 1
  yield 2
  yield 3
}

async function example() {

  const streamLike1: Iterable<number> = [1, 2, 3];
  const streamLike2: AsyncIterable<number> = generateIds();  // is equivalent

  // could consume `streamLike1` or `streamLike2`
  const stream = from(streamLike1)
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

- The example demonstrates how to use the `from` function to turn an iterable into a `composable stream`.
- An asynchronous generator function called `generateIds` is defined that yields the numbers `1, 2, and 3.`
- `streamLike1` is defined as an array containing the numbers `1, 2, and 3`.
- `streamLike2` is defined as an `async iterable` that is equivalent to `generateIds`.
- The `from` function is then used to create a stream from `streamLike1`.
- This stream is then piped through a `map` function that maps each number to an object containing an `id` and a `name` field.
- Finally, the resulting stream is consumed using a `for await` loop

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
      tap((value) => console.log(value))
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
      tap((value) => console.log(value))
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

### `map<Input, Output>(mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output>`

The `map` function is a higher-order function that takes a function `mapper` as input and returns another function that applies the mapper function to every element in a stream. 

The mapper function `transforms` each element of the stream and returns a new output element. 

#### An example

```typescript
import {of, run} from "strict-stream";
import {tap} from "strict-stream/tap";
import {sequence} from "strict-stream/sequence";
import {map} from "strict-stream/map";

async function example() {
  const sequenceStream = of(sequence(3))
    .pipe(
      map((id) => id * 2)
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(sequenceStream)
  // 0
  // 2
  // 4
}

await example();
```

- In the example function, the `of` function is used to create a new stream from the `sequence generator` function that generates a sequence of numbers from `0 to 2`. 
- This stream is then `piped` through the `map` function, which multiplies each number in the stream by 2. 
- The resulting stream is then piped through the `tap` function, which `logs each element` in the stream to the console. 
- Finally, the `run` function is called to consume the stream and output its elements.
- The output of the example function will log the numbers `0, 2, and 4` to the console, which are the result of multiplying the original numbers generated by sequence by `2`.

### `filter<Input>(condition: (input: Input) => Promised<boolean | undefined | null>): StrictStreamMapper<Input, Input>`
The `filter` function is a higher-order function that takes a `condition` function as its input and returns a function that can be used as a `stream mapper`. 

The condition function is applied to each item in the stream, and only those items for which the condition function returns a truthy value are included in the output stream.

#### An example

```typescript
import {of, run} from "strict-stream";
import {tap} from "strict-stream/tap";
import {sequence} from "strict-stream/sequence";
import {filter} from "strict-stream/filter";

async function example() {
  const stream = of(sequence(3))
    .pipe(
      filter((id) => id > 0)
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(stream)
  // 1
  // 2
}

await example();
```

- In the example function, the `of` function is used to create a stream from the `sequence` generator that yields three numbers (`0, 1, and 2`). 
- This stream is then piped to a `filter` mapper that only allows numbers `greater than 0` to pass through. 
- The resulting stream is then piped to a `tap` mapper that `logs each item` to the console. 
- Finally, the `run` function is used to execute the stream and log the output to the console. 
- The output of this code will be the numbers `1 and 2`, since those are the only numbers in the original sequence that meet the filter condition `greater than 0`.

### `reduce<Input, Accumulator>(reducer: (accumulator: Accumulator, input: Input) => Promised<Accumulator>, initial: Accumulator): StrictStreamMapper<Input, Accumulator>`

The `reduce` function is a higher-order function that takes a `reducer` function and an `initial value` as input, and returns a new function that can be used to `transform` a `stream` of values. 

The reducer function takes an `accumulator` value and an `input` value, and returns a `new accumulator` value. 

The reduce function applies the reducer function to each value in the stream, `accumulating` the results into a final value that is `emitted by the resulting stream`.

#### An example

```typescript
import {of, run} from "strict-stream";
import {sequence} from "strict-stream/sequence";
import {reduce} from "strict-stream/reduce";

async function example() {
  const stream = of(sequence(5))
    .pipe(
      reduce(({counter}) => ({counter: counter + 1}), {counter: 0})
    );

  const result = await run(stream);
  console.log(result)
  // { counter: 5 }
}

await example();
```

- In the example, the reduce function is used to count the number of values in a stream. 
- The stream is created using the `sequence` function, which generates a stream of numbers from `0 to 4`. 
- The `reduce` function takes an object with a `counter` property as the `initial value`, and a reducer function that increments the counter property for each input value. 
- The `resulting stream` emits a `single object` with the final value of the counter property, which is `5` in this case. 
- The `run` function is used to execute the stream and log the final result.

### `batch<Input>(size: number): StrictStreamMapper<Input, Input[]>`

- `batch` is a function that returns a `mapper` function that takes an `input stream` and emits an array of inputs that are processed in `batches of a given size`.
- And when the batch reaches the desired size it emits the batch downstream.

#### An example

```typescript
import {of, run} from "strict-stream";
import {sequence} from "strict-stream/sequence";
import {batch} from "strict-stream/batch";

async function example() {
  const stream = of(sequence(3))
    .pipe(
      batch(2)
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(stream)
  // Output
  // [ 0, 1 ]
  // [ 2 ]
}

await example();
```

- The example code creates a `sequence` stream of 3 numbers 
- And pipes it through the `batch` function with a `batch size of 2`. 
- The resulting stream emits two arrays, 
- The first with the values `[0, 1]` and the second with the value `[2]`. 
- The `tap` function is used to log each emitted value to the console.


### `flat<Type>(): StrictStreamMapper<Type | StrictStreamLike<Type>, Type>`

- The `flat` function is a `stream transformer` that flattens the first level of stream or an array (`Iterable`). 
- If the input stream contains arrays or nested streams 
- the `flat` function will iterate over each element in the array or nested stream and emit it as a separate item in the output stream.

#### An example

```typescript
import {run} from "strict-stream";
import {from} from "strict-stream/from";
import {flat} from "strict-stream/flat";
import {tap} from "strict-stream/tap";

async function example() {
  const stream = from(
    [
      [1, 2],
      [3, 4],
      5
    ]
  )
    .pipe(
      flat()
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(stream)
  // 1
  // 2
  // 3
  // 4
  // 5
}

await example();
```

- In the example code, the `from` function is used to create a stream from an array that contains nested arrays and a single value. 
- The `flat` function is then used to `flatten` the first level of stream so that each element in the nested arrays is emitted as a separate item in the output stream. 
- Finally, the `tap` function is used to log each item.
- When the `example` function is run, the output stream contains each element in the nested arrays and the single value, emitted as separate items in the stream.

### `flatMap<Input, Output>(mapper: (input: Input) => Promised<Output | StrictStreamLike<Output>>): StrictStreamMapper<Input, Output>`

- `flatMap` is a function that `maps each element` of a stream to another stream and `then flattens the first level of resulting stream` of streams into a single stream. 
- It takes a `mapper` function that `maps the input element`. 
- The resulting `stream` is then `flat` mapped, meaning that it is flattened so that all elements are emitted in a single stream.

#### An example

```typescript
import {run} from "strict-stream";
import {from} from "strict-stream/from";
import {flatMap} from "strict-stream/flatMap";

async function example() {
  type User = {
    id: number;
    name: string;
    orders: Order[];
  };

  type Order = {
    id: number;
    product: string;
    price: number;
  };

  const users: User[] = [
    {
      id: 1,
      name: "Alice",
      orders: [
        {id: 101, product: "Widget A", price: 10.0},
        {id: 102, product: "Widget B", price: 20.0},
      ],
    },
    {
      id: 2,
      name: "Bob",
      orders: [
        {id: 201, product: "Widget C", price: 30.0},
        {id: 202, product: "Widget D", price: 40.0},
        {id: 203, product: "Widget E", price: 50.0},
      ],
    },
  ];

  async function fetchStreamOfUsers(): Promise<StrictStreamOf<User>> {
    return from(users);
  }

  // StrictStreamOf<{userId: number, orderId: number}
  const stream = (await fetchStreamOfUsers())
    .pipe(
      flatMap(async (user) => {
        return from(user.orders)
          .pipe(
            map(
              async (order) => {
                return {
                  userId: user.id,
                  orderId: order.id,
                  price: order.price
                }
              })
          )
      })
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(stream)
  // { userId: 1, orderId: 101, price: 10 }
  // { userId: 1, orderId: 102, price: 20 }
  // { userId: 2, orderId: 201, price: 30 }
  // { userId: 2, orderId: 202, price: 40 }
  // { userId: 2, orderId: 203, price: 50 }
}

await example();
```

- In the provided example, `flatMap` is used to `flatten` the orders of the `users`. 
- A stream of `users` is created using the `from` function. 
- The `flatMap` function is then called on this stream, mapping each user to a stream of orders using the `from` function again. 
- The resulting `stream of orders` is then `mapped to an object` with the `userId`, `orderId`, and `price` using the `map` function. 
- Finally, the resulting stream of objects is logged using the `tap` function.
- When the stream is run using the `run` function, it logs each object in the stream, which contains the `userId`, `orderId`, and `price` for each order.

### `pipe<In, Out>(mapper: StrictStreamMapper<In, Out>): StrictStreamPlumber<In, Out>`

- The `pipe` function is used to create `composable behavior` for `StrictStream`s. 
- It takes a `StrictStreamMapper` as an input, which is a function that transforms a `StrictStream` of one type to a `StrictStream` of another type. 
- `pipe` then returns a `StrictStreamPlumber`, which is a function that takes a `StrictStream` of the original input type and returns a `StrictStream` of the final output type.
- `pipe` also has a `pipe` method on the returned function, which allows for easy `composition of multiple` `StrictStreamMapper`s. 


#### An example

```typescript
import {run, pipe} from "strict-stream";
import {from} from "strict-stream/from";
import {map} from "strict-stream/map";

async function example() {
  // composable behavior
  const addFive = pipe(
    map((input: number) => input + 4)
  )
    .pipe(
      map(async (input) => input + 1)
    )

  // High order function to manage / compose part of the pipe
  function multiple(x: number) {
    return pipe(
      map(async (value: number) => value * x)
    );
  }

  const stream = from([1, 2, 3])
    .pipe(
      addFive
    )
    .pipe(multiple(2))
    .pipe(tap((value) => console.log(value)))

  await run(stream)
  // 12
  // 14
  // 16
}

await example();
```

- In the `example` function, we create two separate `StrictStreamMapper`s using `pipe`.
- We then use the `multiple` function to create another `StrictStreamMapper` that `multiplie`s the input value by a `given number`. 
- We then `compose` these three mappers using `pipe` and use the resulting `StrictStreamPlumber` to create a `stream of numbers`. 
- Finally, we `run` the `stream` and log each value as it is processed. 
- The output will be `12, 14, 16`.

#### An example of `flatMap` implementation

There is a composition of `map` and `flat` functions.

```typescript
export function flatMap<Input, Output>(mapper: (input: Input) => Promised<Output | StrictStreamLike<Output>>): StrictStreamMapper<Input, Output> {
  return pipe(
    map(mapper)
  ).pipe(
    flat()
  );
}
```
- The `flatMap` function is implemented using the `pipe` function, which `composes` a set of `StrictStreamMapper` functions into a single `StrictStreamMapper`. 
- In the implementation of `flatMap`, the `map` function is first applied to the `mapper` argument
- Resulting in a new `StrictStreamMapper` that transforms the input values using the `mapper` function. 
- This transformation may result in an output value or a `StrictStreamLike` object that contains a set of output values.
- The resulting `StrictStreamMapper` is then piped into the `flat` function, which flattens any `StrictStreamLike` objects into a stream of individual output values.

### `scaleSync<Input, Output>(size: number, mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output>`

- Basically the `map` function with desired `concurrency` to process records. That keeps the ordering of output stream unchanged.
- The `scaleSync` function takes two arguments, the first one is a `number` which represents the concurrency, and the second one is a mapper function that maps the `input` to the `output`.

#### An example

```typescript
import {run, of} from "strict-stream";
import {scaleSync} from "strict-stream/scaleSync";

async function fetchUserById(id: number) {
  // some logic to fetch the use
  return {
    id,
    userName: `User ${id}`
  };
}

async function getUserIds() {
  return sequence(3);
}

async function example() {
  const usersStream = of(await getUserIds())
    .pipe(
      // run's the async queries concurrently, keeps the ordering of output stream unchanged
      scaleSync(5, async (id) => fetchUserById(id))
    )
    .pipe(
      tap((value) => console.log(value))
    );

  await run(usersStream)
  // { id: 0, userName: 'User 0' }
  // { id: 1, userName: 'User 1' }
  // { id: 2, userName: 'User 2' }
}

await example();
```

- In the example, the `scaleSync` function is used to `fetch user` details for a given set of user ids. 
- The `fetchUserById` function fetches the user details `asynchronously` for a given `user id`, and the `getUserIds` function `generates a stream` of user ids. 
- The `usersStream` is created with concurrency of 5, and executing the `fetchUserById` function for each id. 
- The resulting `user details` are logged to the console using the `tap` function.


### `concatenate<T>(...streams: StrictStream<any>[]): StrictStream<T>`
- `concatenate` is a function that concatenates multiple streams into a single stream
- ensuring that the records are read sequentially one by one, and maintains the ordering of the output stream unchanged.
- The implementation of the function is done using rest parameters to allow for an `arbitrary number of streams to be concatenated`

#### An example

```typescript
import {run, of} from "strict-stream";
import {concatenate} from "strict-stream/concatenate";
import {from} from "strict-stream/from";
import {tap} from "strict-stream/tap";

async function* generateIds() {
  yield 10
  yield 20
  yield 30
}

async function example() {

  const streamLike1: Iterable<number> = [1, 2, 3];
  const streamLike2: AsyncIterable<number> = generateIds();  // is equivalent

  const stream = from(
    concatenate(
      from(streamLike1),
      from(streamLike2),
    )
  ).pipe(
    tap((value) => console.log(value))
  );

  await run(stream)
  // 1
  // 2
  // 3
  // 10
  // 20
  // 30
}

await example();
```

- In the provided example, two stream-likes, one iterable and one async iterable, are concatenated using `concatenate`. 
- The resulting stream is then converted into a strict stream using the `from` function
- And a `tap` operation is performed on it to log each record. 
- Finally, the stream is run using the `run` function, which is a utility function to consume and execute the stream. 
- The output shows that the resulting stream contains all the records from both input streams in the correct order.

### `interval(ms: number, startImmediate = false): IInterval`

- `interval` is a function that creates a `stream` that emits a sequence of integers at regular intervals. 
- It takes two parameters: the `duration` of the interval in `milliseconds`, and a `boolean flag` indicating whether the stream should start emitting `immediately` or after one interval has elapsed.
- The function returns a `StrictStream` object with an additional method `stop` that can be used to stop the interval stream.

#### An example

```typescript
import {run, of} from "strict-stream";
import {tap} from "strict-stream/tap";
import {map} from "strict-stream/map";
import {interval} from "strict-stream/interval";

async function example() {
  // every 300ms
  const source = interval(300);

  let counter = 0;

  const stream = of(source)
    .pipe(
      map(() => {
        counter++

        if (counter > 3) {
          // stops the interval stream
          source.stop()
        }

        return counter;
      })
    )
    .pipe(
      tap((value) => console.log(value))
    )

  await run(stream)
  // 1
  // 2
  // 3
  // 4
}

await example();
```
 
- This example creates an `interval stream` that emits every `300ms`
- And uses the `map` operator to increment a counter and stop the stream after `4 emissions`. 
- The `tap` operator is used to log the emitted values to the console.


### Node.JS integration
#### `nodeReadable<Output>(readable: Readable): StrictStreamOf<Output>`
Turns readable to `StrictStreamOf`

```typescript
import {nodeReadable} from "strict-stream/nodeReadable";
import {Readable} from "stream";

const readable = Readable.from('Hello Stream');

const stream = nodeReadable<string>(readable)
  .pipe(map((chunk) => `${chunk} + OK`))
```

#### `nodeWritable<Type>(writable: Writable, encoding: BufferEncoding = 'utf-8'): StrictStreamMapper<Type, Type>`
Integrates writable stream

```typescript
import {from} from "strict-stream/from";
import {nodeWritable} from "strict-stream/nodeWritable";
import {Readable, Writable} from "stream";

const written: { chunk: any }[] = []
const myWritable = new Writable({
  write(chunk, encoding: BufferEncoding, callback) {
    written.push({chunk})
    callback()
  },
});

const buffer = Buffer.from([100, 101, 102]);
const stream = from([buffer])
  .pipe(nodeWritable(myWritable));
```

#### `nodeTransform<Input, Output>(transform: Transform, options: ReadableOptions = {}): StrictStreamMapper<Input, Output>`
Integrates transform stream

```typescript
import {from} from "strict-stream/from";
import {nodeTransform} from "strict-stream/nodeTransform";
import {Readable, Transform} from "stream";

const myTransform = new Transform({
  transform(chunk: any, encoding, callback) {
    callback(null, `${chunk} + OK`)
  },
});

const stream = from(Readable.from('Hello'))
  .pipe(nodeTransform(myTransform));
```


## Beta API

### Beta Transformations

#### `scale<Input, Output>(max: number, mapper: (input: Input) => Promised<Output>): StrictStreamMapper<Input, Output>`
Maps the stream with `max` concurrently. Does not guarantee the ordering of stream items for sure. See `scaleSync` for the ordered stream.
```typescript
const out = of(sequence(4))
  .pipe(
    scale(10, async (value) => {
      return value
    })
  );
```
#### `batchTimed<Input>(size: number, maxTimeout: Milliseconds): StrictStreamMapper<Input, Input[]>`

Emit batches by `size` or `maxTimeout`; Useful in the `infinity` streams to handle batches.

```typescript
// batch by timeout
const stream = of(sequence(5))
  .pipe(tap(() => {
    return delay(100)
  }))
  .pipe(batchTimed(2, 10));
```

```typescript
// batch by timeout
const stream = of(sequence(5))
  .pipe(tap(() => {
    return delay(100)
  }))
  .pipe(batchTimed(2, 10));
```

```typescript
// batch by size
const stream = of(sequence(5))
  .pipe(tap(() => {
    return delay(10)
  }))
  .pipe(batchTimed(2, 500));
```

#### `buffer<Input>(size: number): StrictStreamMapper<Input, Input>`

Simply adds a bit of buffer to have more room for reader / upstream. 

```typescript
const out = of(sequence(4))
  .pipe(
    buffer(3)
  );
```

### Beta Source Operations
#### `merge<Type>(...streams: StrictStream<any>[]): StrictStream<Type>`

Merge streams concurrently. Does not guarantee the ordering. See `concatenate` for ordered streams.

```typescript
const usersV1Stream = from([{type: 'userV1', name: 'User Name'}])
  .pipe(tap(() => delay(100)));

const usersV2Stream = from([{type: 'userV2', firstName: 'User', lastName: 'Name'}]);
const usersStream = merge(usersV1Stream, usersV2Stream);
```

#### `objectReader<T extends object | object[]>(read: () => Promised<T | null | undefined | boolean | number>): StrictStream<T>`

Simplifies reading source of objects;

```typescript
const array = [{id: 1}, {id: 2}]
const stream = objectReader(() => array.shift());
```

### Utilities
#### `toArray<T>(input: StrictStream<T>): Promise<T[]>`
Not recommended for production usage. Could lead to RAM consumption.
```typescript
const stream = from([1, 2, 3]);
const outputs = await toArray(stream);

expect(outputs).toEqual([1, 2, 3])
```

## License

`strict-stream` is licensed under the **MIT License**.
