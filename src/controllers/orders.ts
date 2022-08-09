import express, { Request, Response } from 'express'
import { Order, OrdersStore } from '../models/order'

const store = new OrdersStore();

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index()
        res.status(200).json({
            data: orders
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

const show = async (_req: Request, res: Response) => {
    try {
        const id: string = _req.params.id;
        const order = await store.show(id)
        console.log(order)
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

const create = async (_req: Request, res: Response) => {
    try {
        const order: Order = {
            status: _req.body.status,
            user_id: _req.body.user_id
        }
        const newOrder = await store.create(order)
        res.status(200).json({
            msg: `order created successfully on id: ${newOrder.id}`
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error
        })
    }
}

const update = async (_req: Request, res: Response) => {
    try {
        const order: Order = {
            id: _req.params.id,
            status: _req.body.status,
            user_id: _req.body.user_id,
        }
        const updated = await store.update(order)
        res.json({
            msg: `Order updated successfully on id: ${order.id}`
        })
    } catch (err) {
        console.log(err)
    }
}

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(_req.params.id)
    try {
        res.json({
            msg: `Order ${_req.params.id} deleted`
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const orders_routes = (app: express.Application) => {
    // orders routes resources
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', create)
    app.put('/orders/:id', update)
    app.delete('/orders/:id', destroy)
}

export default orders_routes;
