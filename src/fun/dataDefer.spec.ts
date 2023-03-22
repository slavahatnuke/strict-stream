import {describe, expect, it} from "vitest";
import {DataDefer} from "./dataDefer";

describe(DataDefer.name, () => {
  it('test', async () => {
    const dataDefer = DataDefer<'Request1', 'Response1'>('Request1');
    dataDefer.resolve('Response1')

    expect(dataDefer.data).toEqual('Request1')
    expect(await dataDefer.promise).toEqual('Response1')
  });
})