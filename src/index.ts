import 'dotenv/config';

import {connectDatabase, ensureDatabaseExists} from "./db/db"

const startApp = async () => {
  try {
    await ensureDatabaseExists();

    await connectDatabase();
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

startApp()
