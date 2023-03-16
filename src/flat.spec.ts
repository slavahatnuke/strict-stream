import {describe, expect, it} from "vitest";
import {from} from "./from";
import {toArray} from "./toArray";
import {map} from "./map";
import {sequence} from "./sequence";
import {flat} from "./flat";

describe(flat.name, () => {
    it('flatten a stream of array', async () => {
        const usersWithOrders = from([
            {
                name: 'user',
                userId: 'userId',
                orders: [
                    {productId: 'product-1', price: 125},
                    {productId: 'product-1', price: 444}
                ]
            }
        ])

            .pipe(map((value) => {
                // to be sure it could flatten array of orders
                return [...value.orders]
            }))
            .pipe(flat())
            .pipe(map((order) => order.price))


        const outputs = await toArray(usersWithOrders);

        expect(outputs).toEqual([ 125, 444 ])
    });

    it('flatten a stream of stream', async () => {
        const usersWithOrders = from([
            {
                name: 'user',
                userId: 'userId',
                orders: [
                    {productId: 'product-1', price: 125},
                    {productId: 'product-1', price: 444}
                ]
            }
        ])

            .pipe(map((value) => {
                // to be sure it could flatten array of orders
                return from(value.orders)
            }))
            .pipe(flat())
            .pipe(map((order) => order.price))

        const outputs = await toArray(usersWithOrders);

        expect(outputs).toEqual([ 125, 444 ])
    });
})