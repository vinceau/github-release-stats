# Github Releases Download Count Server

Github provides a nice API for fetching the total release download counts but it does not provide historical download counts over time. This project contains the server which stores download counts at a given point in time. The frontend which visualises these download counts in a pretty graph can be found at [this repo](https://github.com/vinceau/github-stats).

## Usage

Declare the following environmental variable.

| Variable        | Description                                  |
| --------------- | -------------------------------------------- |
| `GITHUB_TOKEN`  | For connecting to Github's GraphQL API       |
| `PSQL_USER`     | Username for connecting to the PSQL database |
| `PSQL_PASSWORD` | Password for connecting to the PSQL database |
| `PSQL_HOST`     | The host URL                                 |
| `PSQL_PORT`     | The port of the postgres server              |
| `PSQL_DATABASE` | The name of the database                     |

```sh
yarn install     # install dependencies
yarn run start   # start the server
```

You may also need to run `yarn run clean` when major changes are made.


[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
