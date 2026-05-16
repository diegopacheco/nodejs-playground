import { z } from "zod";

const API = "http://localhost:3001";

const Movie = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number(),
  genre: z.string(),
  pricePerDay: z.number(),
  available: z.number()
});

const Rental = z.object({
  id: z.string(),
  movieId: z.string(),
  customer: z.string(),
  days: z.number(),
  rentedAt: z.string(),
  movie: Movie.optional()
});

export const NewRental = z.object({
  movieId: z.string().min(1),
  customer: z.string().min(1),
  days: z.coerce.number().int().min(1)
});

export async function getMovies() {
  const r = await fetch(`${API}/movies`);
  return z.array(Movie).parse(await r.json());
}

export async function getRentals() {
  const r = await fetch(`${API}/rentals`);
  return z.array(Rental).parse(await r.json());
}

export async function createRental(input) {
  const data = NewRental.parse(input);
  const r = await fetch(`${API}/rentals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error((await r.json()).error?.toString() || "failed");
  return r.json();
}

export async function returnRental(id) {
  const r = await fetch(`${API}/rentals/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("failed");
  return r.json();
}

export async function getOpenApi() {
  const r = await fetch(`${API}/openapi.json`);
  return r.json();
}
