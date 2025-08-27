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
  appHost: string
  movies_upload_dir: string
  hashSalt: number

  redis: {
    host: string
    port: number
    ttl: number
  }
}

// TODO: stupid, need to redo
const DATABASE_LOGGING: Record<string, boolean> = {
  false: false,
  true: true,
}

function getConfig(): ConfigDto {
  const {DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_LOGGING, APP_PORT, APP_HOST, MOVIES_UPLOAD_DIR, REDIS_HOST, REDIS_PORT, HASH_SALT, REDIS_TTL} = process.env

  if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USERNAME || !DB_PASSWORD || !DB_LOGGING) {
    throw new Error('Some of the DB settings not specified')
  }

  const dbPort = Number(DB_PORT)
  const dbLogging = DB_LOGGING.toLowerCase()

  if (isNaN(dbPort)) {
    throw new Error('DB port is not a number')
  }

  if (!APP_HOST) {
    throw new Error('Application host is not specified')
  }

  const appPort = Number(APP_PORT)

  if (isNaN(appPort)) {
    throw new Error('Application port is not a number')
  }

  if (!MOVIES_UPLOAD_DIR) {
    throw new Error('Movies upload directory was not specified')
  }

  if (!REDIS_PORT || !REDIS_HOST || !REDIS_TTL) {
    throw new Error('Redis settings was not specified')
  }

  const redisPort = Number(REDIS_PORT)
  const redisTtl = Number(REDIS_TTL)

  if (isNaN(redisPort)) {
    throw new Error('Redis port is not a number')
  }

  if (isNaN(redisTtl)) {
    throw new Error('Redis TTL is not a number')
  }

  const hashSalt = Number(HASH_SALT)

  if (isNaN(hashSalt)) {
    throw new Error('Hash salt is not a number')
  }

  return {
    database: {
      host: DB_HOST, username: DB_USERNAME, password: DB_PASSWORD, port: dbPort, databaseName: DB_NAME, logging: dbLogging in DATABASE_LOGGING ? DATABASE_LOGGING[dbLogging] : false
    }, appPort, appHost: APP_HOST, movies_upload_dir: MOVIES_UPLOAD_DIR, redis: {host: REDIS_HOST, port: redisPort, ttl: redisTtl}, hashSalt
  }
}

export const config = getConfig();
