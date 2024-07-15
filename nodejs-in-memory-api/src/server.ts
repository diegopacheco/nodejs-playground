import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(express.json());
let pokemons: any[] = [];

app.post('/pokemons', (req, res) => {
	const pokemon = req.body;
	pokemon.id = pokemons.length + 1;
	pokemons.push(pokemon);
	res.status(201).send(pokemon);
});

app.get('/pokemons', (req, res) => {
	res.status(200).send(pokemons);
});

app.get('/pokemons/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const pokemon = pokemons.find(p => p.id === id);
	if (pokemon) {
		res.status(200).send(pokemon);
	} else {
		res.status(404).send({message: "Pokemon not found"});
	}
});

app.delete('/pokemons/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const index = pokemons.findIndex(p => p.id === id);
	if (index > -1) {
		pokemons.splice(index, 1);
		res.status(204).send();
	} else {
		res.status(404).send({message: "Pokemon not found"});
	}
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});