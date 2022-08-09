import express, { Request, Response } from 'express'
import {MythicalWeaponsStore, Weapon} from "../models/mythical_weapon";
const store = new MythicalWeaponsStore();

const index = async (_req: express.Request, res: express.Response) => {
    const weapons  = await store.index();
    try {
        res.json({
            data: weapons
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const show = async (req: express.Request, res: express.Response) => {
    const weapon: Weapon  = await store.show(req.params.id);
    try {
        res.json(weapon)
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const weapon: Weapon = {
            name: req.body.name,
            type: req.body.type,
            weight: req.body.weight
        }
        const id = await store.create(weapon)
        res.json({
            msg: 'Weapon created on id: ' + id
        })
    } catch(error) {
        console.log(error)
        res.send(error)
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const weapon: Weapon = {
            id: req.params.id,
            name: req.body.name,
            type: req.body.type,
            weight: req.body.weight
        }
        await store.update(weapon)
        res.json(weapon)
    } catch (err) {
        console.log(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    try {
        res.json({
            msg: `Weapon ${req.params.id} deleted`
        })
    } catch (err) {
        res.json({
            error: err
        })
    }
}

const mythical_weapons_routes = (app: express.Application) => {
    app.get('/weapons', index)
    app.get('/weapons/:id', show)
    app.post('/weapons', create)
    app.put('/weapons/:id', update)
    app.delete('/weapons/:id', destroy)
}



export default mythical_weapons_routes;
