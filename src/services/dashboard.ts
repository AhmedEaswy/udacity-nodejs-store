import Client from '../database'

export class DashboardQueries {
    // Get all products that have been included in orders
    async productsInOrders(): Promise<{ name: string, price: number, order_id: string }[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id'

            const result = await conn.query(sql);
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to orders ${err}`)
        }
    }
}
