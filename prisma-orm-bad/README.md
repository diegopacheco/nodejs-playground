### Results
Migrate
```
❯ npm run migrate

> prisma-orm-bad@1.0.0 migrate
> npx prisma migrate dev --name init

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

Applying migration `20240717072811_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240717072811_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

✔ Generated Prisma Client (v5.17.0) to ./node_modules/@prisma/client in 318ms

```
Run
```
❯ npm run run

> prisma-orm-bad@1.0.0 run
> npx ts-node script.ts

{ id: 1, email: 'alice@prisma.io', name: 'Alice' }

```