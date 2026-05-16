import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  year: z.number().int().min(1888),
  genre: z.string(),
  pricePerDay: z.number().nonnegative(),
  available: z.number().int().nonnegative()
});

export const RentalSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  customer: z.string().min(1),
  days: z.number().int().min(1),
  rentedAt: z.string()
});

export const NewRentalSchema = RentalSchema.omit({ id: true, rentedAt: true });

export const jsonSchemas = {
  Movie: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Movie",
    type: "object",
    required: ["id", "title", "year", "genre", "pricePerDay", "available"],
    properties: {
      id: { type: "string" },
      title: { type: "string", minLength: 1 },
      year: { type: "integer", minimum: 1888 },
      genre: { type: "string" },
      pricePerDay: { type: "number", minimum: 0 },
      available: { type: "integer", minimum: 0 }
    }
  },
  Rental: {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Rental",
    type: "object",
    required: ["id", "movieId", "customer", "days", "rentedAt"],
    properties: {
      id: { type: "string" },
      movieId: { type: "string" },
      customer: { type: "string", minLength: 1 },
      days: { type: "integer", minimum: 1 },
      rentedAt: { type: "string" }
    }
  }
};
