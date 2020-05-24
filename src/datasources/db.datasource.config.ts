export const config = {
  name: 'db',
  connector: 'postgresql',
  host: process.env.AWS_HOST,
  port: process.env.AWS_PORT,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  database: process.env.AWS_DATABASE,
  ssl: false,
};
