"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: process.env.DB_URL,
});
await client.connect();
const db = (0, node_postgres_1.drizzle)(client);
