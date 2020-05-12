export const config = {
  name: "psqldb",
  connector: "postgresql",
  url: process.env.PSQL_DB_URL,
  host: "localhost",
  port: 5432,
  user: process.env.PSQL_DB_USER,
  password: process.env.PSQL_DB_PASSWORD,
  database: "postgres"
};
