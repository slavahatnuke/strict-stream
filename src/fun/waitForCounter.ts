import { waitForMessage } from './topic';
import { ICounter } from './conter';

export async function waitForCounter(
  counter: ICounter,
  isTrue: (counter: ICounter) => boolean,
): Promise<void> {
  if (!isTrue(counter)) {
    await waitForMessage(counter.subscribe, () => isTrue(counter));
  }
}
