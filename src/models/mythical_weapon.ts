import Client from '../database'

export type Weapon = {
  id?: string
  name: string
  type: string
  weight: number
}

export class MythicalWeaponsStore {
  async index(): Promise<Weapon[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM mythical_weapons'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Can not connect to mythical_weapons ${err}`)
    }
  }

  async show(id: string): Promise<Weapon> {
    try {
      const sql = 'SELECT * FROM mythical_weapons WHERE id=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Can not show to mythical_weapons on id: ${id} ${err}`)
    }
  }

  async create(weapon: Weapon): Promise<Weapon> {
    try {
      const sql =
        'INSERT INTO mythical_weapons (name, type, weight) VALUES($1, $2, $3) RETURNING *'
      const conn = await Client.connect()
      const result = await conn.query(sql, [
        weapon.name,
        weapon.type,
        weapon.weight,
      ])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(
        `Can not create to mythical_weapons on id: ${weapon} ${err}`
      )
    }
  }

  async update(weapon: Weapon): Promise<Weapon> {
    try {
      const sql =
        `UPDATE mythical_weapons SET name = $1, type = $2, weight = $3 WHERE id = ($4);`
      const conn = await Client.connect()
      const result = await conn.query(sql, [
        weapon.name,
        weapon.type,
        weapon.weight,
        weapon.id,
      ])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(
        `Can not update to mythical_weapons on id: ${weapon} ${err}`
      )
    }
  }

  async delete(id: string): Promise<Weapon> {
    try {
      const sql = 'DELETE FROM mythical_weapons WHERE id=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Can not delete to mythical_weapons on id: ${id} ${err}`)
    }
  }
}
