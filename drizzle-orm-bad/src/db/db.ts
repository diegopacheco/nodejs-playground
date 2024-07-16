require('dotenv').config();
const { Pool } = require('pg');
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DB_URL;
if (typeof connectionString !== 'string') {
  throw new Error('Database connection string must be a string. Current type is: ' + typeof connectionString);
}

export const db = drizzle(new Pool({
  connectionString: connectionString.toString(),
}));
