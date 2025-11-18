import { test, expect, beforeAll, afterAll } from "bun:test";

let server: any;
const PORT = 3001;

beforeAll(async () => {
  const { prince } = await import("princejs");
  const app = prince();
  app.get("/", () => ({ message: "Hello!" }));
  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 100));
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

test("GET / returns message Hello!", async () => {
  const response = await fetch(`http://localhost:${PORT}/`);
  const data = await response.json();
  expect(data).toEqual({ message: "Hello!" });
});

test("GET / returns status 200", async () => {
  const response = await fetch(`http://localhost:${PORT}/`);
  expect(response.status).toBe(200);
});

test("GET / returns JSON content type", async () => {
  const response = await fetch(`http://localhost:${PORT}/`);
  const contentType = response.headers.get("content-type");
  expect(contentType).toContain("application/json");
});
