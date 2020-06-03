console.log("node env: " + process.env.NODE_ENV);

const prodConfig = {
  name: "db",
  connector: "postgresql",
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  database: process.env.PSQL_DATABASE,
  ssl: false,
};

const devConfig = {
  name: "db",
  connector: "postgresql",
  host: "localhost",
  port: "5432",
  user: "user",
  password: "password",
  database: "postgres",
  ssl: false,
};

export const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;
