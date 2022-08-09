import Client from '../database'

export type Order = {
    id?: string
    status: string
    user_id: string
}

export type NewOrderProduct = {
    product_id: string,
    quantity: number,
    order_id: string
}

export class OrdersStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not show to orders on id: ${id} ${err}`)
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                order.status,
                order.user_id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not create to orders on id: ${order} ${err}`
            )
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const sql =
                `UPDATE orders SET status = $1, user_id = $2 WHERE id = ($3);`
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                order.status,
                order.user_id,
                order.id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update to orders on id: ${order} ${err}`
            )
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not delete to orders on id: ${id} ${err}`)
        }
    }

    async addProduct(orderProduct: NewOrderProduct): Promise<Order> {
        // get order to see if it is open
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()

            const result = await conn.query(ordersql, [orderProduct.order_id])

            const order = result.rows[0]

            if (order.status !== "open") {
                throw new Error(`Could not add product ${orderProduct.product_id} to order ${orderProduct.order_id} because order status is ${order.status}`)
            }

            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql =
                'INSERT INTO order_products (product_id, quantity, order_id) VALUES($1, $2, $3) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                orderProduct.product_id,
                orderProduct.quantity,
                orderProduct.order_id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not add product to order on id: ${orderProduct.product_id} ${err}`
            )
        }
    }
}
