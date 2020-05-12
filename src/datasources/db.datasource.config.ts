export const config = {
  name: 'db',
  connector: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  database: 'postgres',
  ssl: false,
};
