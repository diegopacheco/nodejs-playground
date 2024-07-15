import bodyParser from 'body-parser';
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
  return open({
    filename: './pokemons.db',
    driver: sqlite3.Database,
  });
}
async function initializeDb() {
  const db = await openDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS pokemons 
	(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT)`);
}
initializeDb();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
let pokemons: any[] = [];

app.post('/pokemons', async (req, res) => {
	const { name, type } = req.body;
	const db = await openDb();
	const result = await db.run('INSERT INTO pokemons (name, type) VALUES (?, ?)', [name, type]);
	const pokemon = await db.get('SELECT * FROM pokemons WHERE id = ?', [result.lastID]);
	res.status(201).send(pokemon);
});

app.get('/pokemons', async (req, res) => {
	const db = await openDb();
	const pokemons = await db.all('SELECT * FROM pokemons');
	res.status(200).send(pokemons);
});

app.get('/pokemons/:id', async (req, res) => {
	const id = parseInt(req.params.id);
	const db = await openDb();
	const pokemon = await db.get('SELECT * FROM pokemons WHERE id = ?', [id]);
	if (pokemon) {
		res.status(200).send(pokemon);
	} else {
		res.status(404).send({ message: "Pokemon not found" });
	}
});

app.delete('/pokemons/:id', async (req, res) => {
	const id = parseInt(req.params.id);
	const db = await openDb();
	const result = await db.run('DELETE FROM pokemons WHERE id = ?', [id]);
	if (result.changes ?? 0) {
		res.status(204).send();
	} else {
		res.status(404).send({ message: "Pokemon not found" });
	}
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});