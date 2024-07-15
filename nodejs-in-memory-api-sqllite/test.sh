#!/bin/bash

# add
curl -i -X POST http://localhost:3000/pokemons \
-H "Content-Type: application/json" \
-d '{"name":"Pikachu", "type":"Electric"}'

# Get all
curl -i -X GET http://localhost:3000/pokemons

# Get by ID
curl -i -X GET http://localhost:3000/pokemons/1

# delete by ID
curl -i -X DELETE http://localhost:3000/pokemons/1
curl -i -X GET http://localhost:3000/pokemons