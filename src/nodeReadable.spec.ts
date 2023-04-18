import { describe, expect, it } from 'vitest';
import { toArray } from './toArray';
import { map } from './map';
import { Readable } from 'stream';
import { nodeReadable } from './nodeReadable';

describe(nodeReadable.name, () => {
  it('supports node readable', async () => {
    const readable = Readable.from('Hello Stream');

    const stream = nodeReadable<string>(readable).pipe(
      map((chunk) => `${chunk} + OK`),
    );

    const outputs = await toArray(stream);

    expect(outputs).toEqual(['Hello Stream + OK']);
  });
});
