import express, { Request, Response } from 'express'
import { Product, ProductsStore } from '../models/product'

const store = new ProductsStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index()
        res.status(200).json({
            data: products
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
        const product = await store.show(id)
        console.log(product)
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

const create = async (_req: Request, res: Response) => {
    try {
        const product: Product = {
            name: _req.body.name,
            price: _req.body.price
        }
        const newProduct = await store.create(product)
        res.status(200).json({
            msg: `product created successfully on id: ${newProduct.id}`
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
        const product: Product = {
            id: _req.params.id,
            name: _req.body.name,
            price: _req.body.price,
        }
        const updated = await store.update(product)
        res.json({
            msg: `Product updated successfully on id: ${product.id}`
        })
    } catch (err) {
        console.log(err)
    }
}

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(_req.params.id)
    try {
        res.json({
            msg: `Product ${_req.params.id} deleted`
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const products_routes = (app: express.Application) => {
    // products routes resources
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', create)
    app.put('/products/:id', update)
    app.delete('/products/:id', destroy)
}

export default products_routes;
