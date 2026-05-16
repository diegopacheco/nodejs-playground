import { Library } from "@apicurio/data-models";
import { jsonSchemas } from "./schemas.js";

const template = {
  openapi: "3.0.2",
  info: {
    title: "Movie Rental API",
    version: "1.0.0",
    description: "POC API built with Zod + Apicurio Registry + Apicurio Data Models"
  },
  paths: {
    "/movies": {
      get: {
        operationId: "listMovies",
        summary: "List all movies",
        responses: {
          "200": {
            description: "Array of movies",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Movie" } }
              }
            }
          }
        }
      }
    },
    "/rentals": {
      get: {
        operationId: "listRentals",
        summary: "List active rentals",
        responses: {
          "200": {
            description: "Array of rentals",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Rental" } }
              }
            }
          }
        }
      },
      post: {
        operationId: "createRental",
        summary: "Rent a movie",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["movieId", "customer", "days"],
                properties: {
                  movieId: { type: "string" },
                  customer: { type: "string" },
                  days: { type: "integer", minimum: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Rental created" },
          "400": { description: "Invalid input" },
          "404": { description: "Movie not found" },
          "409": { description: "Out of stock" }
        }
      }
    },
    "/rentals/{id}": {
      delete: {
        operationId: "returnRental",
        summary: "Return a rented movie",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Returned rental" },
          "404": { description: "Rental not found" }
        }
      }
    }
  },
  components: {
    schemas: Object.fromEntries(
      Object.entries(jsonSchemas).map(([k, v]) => {
        const { $schema, ...rest } = v;
        return [k, rest];
      })
    )
  }
};

export function buildOpenApi() {
  const doc = Library.readDocumentFromJSONString(JSON.stringify(template));
  const problems = Library.validate(doc, null);
  return {
    doc: Library.writeNode(doc),
    problems: (problems || []).map(p => ({
      code: p.errorCode,
      message: p.message,
      severity: String(p.severity)
    }))
  };
}
