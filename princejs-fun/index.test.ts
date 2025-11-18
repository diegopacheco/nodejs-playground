import { test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "./index";

let server: any;
const PORT = 3001;

beforeAll(async () => {
  server = app.listen(PORT);
  await new Promise(resolve => setTimeout(resolve, 100));
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

test("app is exported", () => {
  expect(app).toBeDefined();
  expect(typeof app.listen).toBe("function");
  expect(typeof app.get).toBe("function");
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

test("GET /nonexistent returns 404", async () => {
  const response = await fetch(`http://localhost:${PORT}/nonexistent`);
  expect(response.status).toBe(404);
});

test("POST / returns 405 for method not allowed", async () => {
  const response = await fetch(`http://localhost:${PORT}/`, {
    method: "POST",
  });
  expect(response.status).toBe(405);
});

test("DELETE / returns 405 for method not allowed", async () => {
  const response = await fetch(`http://localhost:${PORT}/`, {
    method: "DELETE",
  });
  expect(response.status).toBe(405);
});

test("PUT / returns 405 for method not allowed", async () => {
  const response = await fetch(`http://localhost:${PORT}/`, {
    method: "PUT",
  });
  expect(response.status).toBe(405);
});
