import 'dotenv/config';

import * as express from "express";
import {config} from "./config/config";
import {connectDatabase, ensureDatabaseExists} from "./db/db"
import {movieRouter as MovieRouter} from "./routers/moview.router";
import {httpErrorMiddleware} from "./middlewares/http-exception.middleware";
import { authRouter as AuthRouter } from "./routers/auth.router";

const {appPort, appHost, movies_upload_dir} = config;

const app = express();

app.use(express.json())
app.use("/api/v1/movies", MovieRouter);
app.use("/api/v1/auth", AuthRouter);
app.use(httpErrorMiddleware)
app.use(`/${movies_upload_dir}`, express.static(movies_upload_dir));

const startApp = async () => {
  try {
    // TODO: find another way to do this
    await ensureDatabaseExists();

    await connectDatabase();

    app.listen(appPort, appHost, () => {
      console.log(`\nServer is listening on ${appPort} port`);
    })
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

startApp()
