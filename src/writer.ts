import {Defer, IDefer} from "./fun/defer";
import {of, StrictStream} from "./index";
import {reader} from "./reader";
import {flat} from "./flat";

export type IWriter<T> = {
  stream: StrictStream<T>;
  write: (data: T) => Promise<void>;
  finish: () => Promise<void>;
  length(): number;
};

export function Writer<T>(bufferSize = 1): IWriter<T> {
  let records: T[] = [];

  let weWaitUntilRecordsConsumed: IDefer<void> | undefined = undefined;
  let weWaitForRecordsToRead: IDefer<void> | undefined = undefined;

  let finishing = false;

  const read = async (): Promise<T[] | typeof reader.DONE> => {
    if (!records.length) {
      if (finishing) {
        return reader.DONE;
      }

      if (!weWaitForRecordsToRead) {
        weWaitForRecordsToRead = Defer<void>();
      }

      // waiting to read
      await weWaitForRecordsToRead.promise;
    }

    const currentRecords = [...records];
    records = [];

    if (weWaitUntilRecordsConsumed) {
      weWaitUntilRecordsConsumed.resolve();
      weWaitUntilRecordsConsumed = undefined;
    }

    if (finishing) {
      if (currentRecords.length) {
        return currentRecords;
      } else {
        return reader.DONE;
      }
    }

    return currentRecords;
  };

  return {
    async write(data: T) {
      if (finishing) {
        throw new Error(`Buffer is finishing, impossible to write`);
      }

      records.push(data);

      if (weWaitForRecordsToRead) {
        weWaitForRecordsToRead.resolve();
        weWaitForRecordsToRead = undefined;
      }

      if (records.length >= bufferSize) {
        if (!weWaitUntilRecordsConsumed) {
          weWaitUntilRecordsConsumed = Defer<void>();
        }

        await weWaitUntilRecordsConsumed.promise;
      }
    },

    async finish() {
      finishing = true;

      if (weWaitForRecordsToRead) {
        weWaitForRecordsToRead.resolve();
        weWaitForRecordsToRead = undefined;
      }

      if (weWaitUntilRecordsConsumed) {
        await weWaitUntilRecordsConsumed.promise;
        weWaitUntilRecordsConsumed = undefined;
      }
    },

    length(): number {
      return records.length
    },

    stream: of(reader(read)).pipe(flat()),
  };
}