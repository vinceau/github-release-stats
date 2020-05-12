export const config = {
  name: 'download_count',
  connector: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: process.env.PSQL_DB_USER,
  password: process.env.PSQL_DB_PASSWORD,
  database: 'postgres',
  ssl: false,
};
