import { of, StrictStreamOf } from './index';
import { Readable } from 'stream';

export function nodeReadable<Output>(
  readable: Readable,
): StrictStreamOf<Output> {
  return of<Output>(readable);
}
