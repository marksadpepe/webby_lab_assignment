import { Sequelize } from 'sequelize-typescript';
import { config } from '../config/config';
import { Client } from 'pg';
import { MovieModel } from '../models/movie.model';
import { ActorModel } from '../models/actor.model';
import { MovieActorModel } from '../models/movie-actor.model';
import { UserModel } from '../models/user.model';

const {
  database: { databaseName, host, port, password, username, logging },
} = config;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host,
  port,
  username,
  password,
  database: databaseName,
  logging,
});

sequelize.addModels([MovieModel, ActorModel, MovieActorModel, UserModel]);

export async function ensureDatabaseExists() {
  const client = new Client({
    host,
    port,
    user: username,
    password,
    database: 'postgres',
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [databaseName],
  );

  if (!res.rowCount) {
    await client.query(`CREATE DATABASE ${databaseName}`);
  }

  await client.end();
}

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    throw new Error(`Failed to connect to the DB: ${err}`);
  }
}
