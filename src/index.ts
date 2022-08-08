import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import mythical_weapons_routes from "./routes/weapons";
import users_routes from "./routes/users";

dotenv.config()

const app: express.Application = express()
const PORT: number | string = process.env.PORT || 3000

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// weapons routing
mythical_weapons_routes(app)
users_routes(app)

app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}!`)
)

export default app
