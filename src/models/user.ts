import Client from '../database'
import bcrypt from 'bcrypt'

export type User = {
    id?: string
    first_name: string
    last_name: string
    email: number,
    password?: string
}

export type Data = {
    user?: User,
    msg: string
}

export type UserLogin = {
    email: number,
    password?: string
}

const   pepper = process.env.BCRYPT_PASSWORD,
        saltRounds = process.env.SALT_ROUNDS || 10;

export class UsersStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT id, first_name, last_name, email, created_at FROM users'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Can not connect to users ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT id, first_name, last_name, email, created_at FROM users WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not show to users on id: ${id} ${err}`)
        }
    }

    async create(user: User): Promise<User> {
        try {
            const hash = bcrypt.hashSync(`${user.password}${pepper}`, Number(saltRounds));
            const sql = 'INSERT INTO users (first_name, last_name, email, password, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *'
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                user.email,
                hash,
                new Date()
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not create to users on id: ${user} ${err}`
            )
        }
    }

    async update(user: User): Promise<User> {
        try {
            const sql =
                `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = ($4);`
            const conn = await Client.connect()
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                user.email,
                user.id,
            ])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(
                `Can not update to users on id: ${user} ${err}`
            )
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Can not delete to users on id: ${id} ${err}`)
        }
    }

    async authenticate(u: UserLogin): Promise<Data> {
        const   conn = await Client.connect(),
                sql = 'SELECT * FROM users WHERE email=($1)',
                result = await conn.query(sql, [u.email]);
        if (result.rows.length) {
            const user = result.rows[0]
            if (bcrypt.compareSync(`${u.password}${pepper}`, user.password)) {
                return {
                    msg: 'User authenticated Successfully',
                    user: user
                };
            } else {
                return {
                    msg: 'Invalid password'
                };
            }
        } else {
            return {
                msg: 'User Not Found'
            };
        }

    }
}
