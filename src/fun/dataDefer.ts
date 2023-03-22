import {Defer, IDefer} from "./defer";

export type IDataDefer<Data, Output> = IDefer<Output> & { data: Data };

export function DataDefer<Data, Output>(data: Data): IDataDefer<Data, Output> {
  const defer = Defer<Output>() as IDataDefer<Data, Output>;
  defer.data = data;
  return defer
}