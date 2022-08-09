import express, { Request, Response } from "express";

import {DashboardQueries} from "../services/dashboard";

const dashboard = new DashboardQueries();

const productsInOrders = async (_req: Request, res: Response) => {
    const products = await dashboard.productsInOrders();
    res.json({
        data: products
    })
}

const UsersWithOrders = async (_req: Request, res: Response) => {
    const products = await dashboard.UsersWithOrders();
    res.json({
        data: products
    })
}

const fiveMostExpensive = async (_req: Request, res: Response) => {
    const products = await dashboard.fiveMostExpensive();
    res.json({
        data: products
    })
}

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', productsInOrders)
    app.get('/users_with_orders', UsersWithOrders)
    app.get('/five-most-expensive', fiveMostExpensive)
}

export default dashboardRoutes;
