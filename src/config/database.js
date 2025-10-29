import { Sequelize } from 'sequelize';

const {
  DB_HOST = '',
  DB_PORT = '',
  DB_NAME = '',
  DB_USER = '',
  DB_PASSWORD = '',
  DB_DIALECT = 'mysql',
  DB_LOGGING = 'false'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT,
  logging: DB_LOGGING === 'true' ? console.log : false,
});

export default sequelize;