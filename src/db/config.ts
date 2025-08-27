import { config } from '../config/config';

const {
  database: { logging, username, password, port, host, databaseName },
} = config;

module.exports = {
  dialect: 'postgres',
  host,
  port,
  username,
  password,
  database: databaseName,
  logging,
  seederStorage: 'sequelize',
  define: {
    timestamps: true,
  },
};
