import 'dotenv/config';

import * as express from "express";
import {config} from "./config/config";
import {connectDatabase, ensureDatabaseExists} from "./db/db"
import {movieRouter as MovieRouter} from "./routers/moview.router";
import {httpErrorMiddleware} from "./middlewares/http-exception.middleware";

const {appPort} = config;

const app = express();

app.use(express.json())
app.use("/api/v1", MovieRouter);
app.use(httpErrorMiddleware)


const startApp = async () => {
  try {
    await ensureDatabaseExists();

    await connectDatabase();

    app.listen(appPort, () => {
      console.log(`\nServer is listening on ${appPort} port`);
    })
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

startApp()
