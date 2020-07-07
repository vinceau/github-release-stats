# SQL Commands

After sourcing the `.env` file, run the following command. Note: you'll need to manually enter the password in.

```bash
source .env && psql --host=$PSQL_HOST --port=$PSQL_PORT --username=$PSQL_USER --password --dbname=$PSQL_DATABASE
```

## Create the table

```
\i ./db/create.sql
```

## List tables

```
\dt
```

## Backup table

```
\copy (select * from download_count) TO '/path/to/dump/file';
```

Or to copy only specific columns:

```
\copy (select release_id, asset_id, downloads, tstz from download_count) TO '/path/to/dump/file';
```

## Restore table

This will replace (I think) the existing table.

```
\copy download_count from './db/dump/download_count';
```

Copy only specific values, auto generating the serial id:

```
\copy download_count(release_id, asset_id, downloads, tstz) from '/absolute/path/to/dump/file';
```

## Inserting only specific values

Sometimes you only want to insert values which aren't generated (e.g. skip inserting values UUIDs, `created_at` timestamps etc).

```sql
insert into tournaments (name, user_id, start_at, end_at) values ('test tournament', 'test-user-id', NOW(), NOW());
```
