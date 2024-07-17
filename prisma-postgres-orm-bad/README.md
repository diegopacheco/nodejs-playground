### Results
Migrate
```
❯ npm run migrate

> prisma-orm-bad@1.0.0 migrate
> npx prisma migrate dev --name init

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "db", schema "public" at "localhost:5432"

Already in sync, no schema change or pending migration was found.

✔ Generated Prisma Client (v5.17.0) to ./node_modules/@prisma/client in 112ms
```
Run
```
❯ npm run run

> prisma-orm-bad@1.0.0 run
> npx ts-node script.ts

{ id: 1, email: 'alice@prisma.io', name: 'Alice' }

```

```
./pgclient.sh
```
```
db=# select * from pg_catalog.pg_tables where schemaname='public';
 public     | _prisma_migrations | root       |            | t          | f        | f           | f
 public     | User               | root       |            | t          | f        | t           | f
 public     | Post               | root       |            | t          | f        | t           | f

db=# SELECT * FROM public."User";
  1 | alice@prisma.io | Alice
  2 | joh@goef.com    | joehj

db=# 
```