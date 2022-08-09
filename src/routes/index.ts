import express from "express";

import mythical_weapons_routes from "../controllers/weapons";
import weapons_routes from "../controllers/weapons";
import products_routes from "../controllers/products";
import users_routes from "../controllers/users";
import orders_routes from "../controllers/orders";

const routes = (app: express.Application): void => {
    mythical_weapons_routes(app);
    weapons_routes(app);
    products_routes(app);
    users_routes(app);
    orders_routes(app);
}

export default routes;
