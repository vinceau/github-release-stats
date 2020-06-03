const baseConfig = {
  name: "db",
  connector: "postgresql",
  ssl: { rejectUnauthorized: false },
};

const urlConfig = {
  ...baseConfig,
  url: process.env.DATABASE_URL,
};

const standardConfig = {
  ...baseConfig,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  database: process.env.PSQL_DATABASE,
};

export const config = process.env.DATABASE_URL ? urlConfig : standardConfig;
