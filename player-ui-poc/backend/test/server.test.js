import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";
import { loadFlows } from "../src/flows.js";

let server;
let base;

before(async () => {
  server = createApp(loadFlows());
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}/api`;
});

after(() => server.close());

const post = (body) =>
  fetch(`${base}/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body });

test("lists flows with only id and title so the picker stays light", async () => {
  const flows = await (await fetch(`${base}/flows`)).json();
  assert.deepEqual(flows.map((f) => Object.keys(f).sort()), [["id", "title"], ["id", "title"]]);
});

test("serves the full flow content the player renders", async () => {
  const flow = await (await fetch(`${base}/flows/signup`)).json();
  assert.equal(flow.id, "signup");
  assert.ok(flow.views.length > 0);
  assert.ok(flow.navigation.BEGIN);
});

test("unknown flow is a 404", async () => {
  assert.equal((await fetch(`${base}/flows/nope`)).status, 404);
});

test("rejects submissions that do not belong to a served flow", async () => {
  const res = await post(JSON.stringify({ flowId: "nope", outcome: "DONE", data: {} }));
  assert.equal(res.status, 400);
});

test("rejects submissions without an outcome", async () => {
  const res = await post(JSON.stringify({ flowId: "signup", data: {} }));
  assert.equal(res.status, 400);
});

test("rejects malformed json", async () => {
  assert.equal((await post("{")).status, 400);
});

test("stores a finished flow result and returns it in the history", async () => {
  const data = { user: { name: "Ana", email: "ana@mail.com", plan: "pro" } };
  const res = await post(JSON.stringify({ flowId: "signup", outcome: "DONE", data }));
  assert.equal(res.status, 201);
  const history = await (await fetch(`${base}/submissions`)).json();
  assert.deepEqual(history.at(-1).data, data);
  assert.equal(history.at(-1).outcome, "DONE");
});
