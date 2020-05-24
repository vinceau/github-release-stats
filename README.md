# gh-release-stats

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Usage

Declare the following environmental variable.

| Variable        | Description                                  |
| --------------- | -------------------------------------------- |
| `GITHUB_TOKEN`  | For connecting to Github's GraphQL API       |
| `PSQL_USER`     | Username for connecting to the PSQL database |
| `PSQL_PASSWORD` | Password for connecting to the PSQL database |
| `AWS_HOST`      | The host URL on AWS                          |
| `AWS_PORT`      | The port of the postgres server on AWS       |
| `AWS_DATABASE`  | The name of the database on AWS              |

```sh
npm install     # install dependencies
npm run start   # start the server
```

You should also run `npm run clean` when major changes are made.
