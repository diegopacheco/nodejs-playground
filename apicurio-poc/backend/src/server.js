import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { MovieSchema, NewRentalSchema, jsonSchemas } from "./schemas.js";
import { bootstrap, GROUP, REGISTRY_URL } from "./apicurio.js";
import { buildOpenApi } from "./openapi.js";

const movies = [
  { id: "m1", title: "The Matrix", year: 1999, genre: "Sci-Fi", pricePerDay: 3.5, available: 4 },
  { id: "m2", title: "Inception", year: 2010, genre: "Sci-Fi", pricePerDay: 4.0, available: 2 },
  { id: "m3", title: "The Godfather", year: 1972, genre: "Crime", pricePerDay: 3.0, available: 3 },
  { id: "m4", title: "Pulp Fiction", year: 1994, genre: "Crime", pricePerDay: 3.0, available: 5 },
  { id: "m5", title: "Interstellar", year: 2014, genre: "Sci-Fi", pricePerDay: 4.5, available: 1 }
].map(m => MovieSchema.parse(m));

const rentals = [];

const app = express();
app.use(cors());
app.use(express.json());

const openapi = buildOpenApi();

app.get("/health", (_req, res) => res.json({ ok: true, registry: REGISTRY_URL, group: GROUP }));
app.get("/openapi.json", (_req, res) => res.json(openapi.doc));
app.get("/openapi/problems", (_req, res) => res.json(openapi.problems));

app.get("/movies", (_req, res) => res.json(movies));

app.get("/rentals", (_req, res) => {
  const enriched = rentals.map(r => ({
    ...r,
    movie: movies.find(m => m.id === r.movieId)
  }));
  res.json(enriched);
});

app.post("/rentals", (req, res) => {
  const parsed = NewRentalSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const movie = movies.find(m => m.id === parsed.data.movieId);
  if (!movie) return res.status(404).json({ error: "movie not found" });
  if (movie.available <= 0) return res.status(409).json({ error: "out of stock" });
  movie.available -= 1;
  const rental = { id: randomUUID(), rentedAt: new Date().toISOString(), ...parsed.data };
  rentals.push(rental);
  res.status(201).json(rental);
});

app.delete("/rentals/:id", (req, res) => {
  const idx = rentals.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "rental not found" });
  const [removed] = rentals.splice(idx, 1);
  const movie = movies.find(m => m.id === removed.movieId);
  if (movie) movie.available += 1;
  res.json({ returned: removed });
});

const PORT = process.env.PORT || 3001;
bootstrap(jsonSchemas)
  .then(() => {
    app.listen(PORT, () => console.log(`[backend] listening on ${PORT}`));
  })
  .catch(err => {
    console.error("[backend] bootstrap failed:", err.message);
    process.exit(1);
  });
