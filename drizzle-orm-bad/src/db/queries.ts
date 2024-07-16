import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from './db';
import { InsertUser, SelectUser, postsTable, usersTable } from './schema';

export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: number;
    name: string;
    age: number;
    email: string;
  }>
> {
  const database = await db; 
  return database.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getAllUsers() {
  const database = await db;
  return database.select().from(usersTable);
}

export async function createUser(data: InsertUser) {
  const database = await db;
  await database.insert(usersTable).values(data);
}