import express, { Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {UsersStore, User, UserLogin} from "../models/user";
const store = new UsersStore();

const secret = process.env.TOKEN_SECRET || 'secret'

interface verify {
    user: object;
    iat: number,
    exp: number
}

const index = async (_req: express.Request, res: express.Response) => {
    const users  = await store.index();
    try {
        res.json({
            data: users
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const show = async (req: express.Request, res: express.Response) => {
    const user: User  = await store.show(req.params.id);
    try {
        res.json(user)
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            password: req.body.password
        }
        const newUser = await store.create(user)
        const token = jwt.sign({ user: {'email': newUser.email, 'password': newUser.password} }, secret,{ expiresIn: '1h' })
        res.json({
            msg: 'User created Successfully',
            token: token
        })
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}

const update = async (req: Request, res: Response) => {
    const userData: User = {
        id: req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    }
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        const { user } = jwt.verify(token, secret) as JwtPayload
        if (user.user.id == userData.id) {
            await store.update(userData)
            res.json(userData)
        } else {
            throw new Error('user id dose not match')
        }
    } catch (error: any) {
        res.status(400).json({
            error: error.toString(),
            user: userData
        })
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    try {
        res.json({
            msg: `User ${req.params.id} deleted`
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}
const auth = async (req: Request, res: Response) => {
    try {
        const userData: UserLogin = {
            email: req.body.email.toLowerCase(),
            password: req.body.password
        }
        const result = (await store.authenticate(userData))
        const token = jwt.sign({ user: result }, secret, { expiresIn: '1h' })

        if (result.user) {
            delete result.user.password
        }
        res.json({
            data: result,
            token: token
        })
    } catch (err) {
        console.log(err)
        res.json(err)
    }
}

const authToken = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        const verify = jwt.verify(token, secret)

        res.json({
            data: verify
        })
    } catch (err) {
        res.status(401).json('unauthorized')
    }
}

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        const decoded = jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(401).json('unauthorized')
    }
}

const users_routes = (app: express.Application) => {
    // users routes resources
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/users', verifyAuthToken, create)
    app.put('/users/:id', verifyAuthToken, update)
    app.delete('/users/:id', verifyAuthToken, destroy)
    // users auth routes
    app.post('/login', auth)
    app.post('/auth', verifyAuthToken, authToken)
}



export default users_routes;
