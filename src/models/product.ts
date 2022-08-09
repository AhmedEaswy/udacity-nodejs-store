import Client from '../database'

export type Product = {
  id?: string
  name: string
  price: number
}

export class ProductsStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Can not connect to products ${err}`)
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Can not show to products on id: ${id} ${err}`)
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *'
      const conn = await Client.connect()
      const result = await conn.query(sql, [
        product.name,
        product.price,
      ])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(
        `Can not create to products on id: ${product} ${err}`
      )
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const sql =
        `UPDATE products SET name = $1, price = $2 WHERE id = ($3);`
      const conn = await Client.connect()
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.id,
      ])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(
        `Can not update to products on id: ${product} ${err}`
      )
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Can not delete to products on id: ${id} ${err}`)
    }
  }
}
