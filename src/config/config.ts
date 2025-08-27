import 'dotenv/config';

interface ConfigDto {
  database: {
    host: string
    username: string
    password: string
    port: number
    databaseName: string
    logging: boolean
  }

  appPort: number
}

// TODO: stupid, need to redo
const DATABASE_LOGGING: Record<string, boolean> = {
  false: false,
  true: true,
}

function getConfig(): ConfigDto {
  const {DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_LOGGING, APP_PORT} = process.env

  if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USERNAME || !DB_PASSWORD || !DB_LOGGING) {
    throw new Error('Some of the DB settings not specified')
  }

  const dbPort = Number(DB_PORT)
  const dbLogging = DB_LOGGING.toLowerCase()

  if (isNaN(dbPort)) {
    throw new Error('DB port is not a number')
  }

  const appPort = Number(APP_PORT)

  if (isNaN(appPort)) {
    throw new Error('Application port is not a number')
  }

  return {
    database: {
      host: DB_HOST, username: DB_USERNAME, password: DB_PASSWORD, port: dbPort, databaseName: DB_NAME, logging: dbLogging in DATABASE_LOGGING ? DATABASE_LOGGING[dbLogging] : false
    }, appPort
  }
}

export const config = getConfig();
