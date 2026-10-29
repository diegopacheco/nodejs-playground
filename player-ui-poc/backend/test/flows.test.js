import { test } from "node:test";
import assert from "node:assert/strict";
import { loadFlows } from "../src/flows.js";

const flows = [...loadFlows().values()];

function collectAssets(node, found = []) {
  if (Array.isArray(node)) node.forEach((n) => collectAssets(n, found));
  else if (node && typeof node === "object") {
    if (node.type && node.id) found.push(node);
    Object.values(node).forEach((v) => collectAssets(v, found));
  }
  return found;
}

function schemaHasBinding(schema, binding) {
  let type = schema.ROOT;
  for (const part of binding.split(".")) {
    const field = type?.[part];
    if (!field) return false;
    type = schema[field.type];
  }
  return true;
}

test("ships the signup and feedback flows", () => {
  assert.deepEqual(flows.map((f) => f.id).sort(), ["feedback", "signup"]);
});

for (const flow of flows) {
  test(`${flow.id}: every VIEW state points to a view the flow ships, or the player fails at runtime`, () => {
    const viewIds = new Set(flow.views.map((v) => v.id));
    for (const [name, state] of Object.entries(flow.navigation.FLOW_1)) {
      if (state.state_type === "VIEW") assert.ok(viewIds.has(state.ref), `${name} -> ${state.ref}`);
    }
  });

  test(`${flow.id}: every transition lands on a declared state, or the user gets stuck`, () => {
    const machine = flow.navigation.FLOW_1;
    assert.ok(machine[machine.startState], "startState");
    for (const [name, state] of Object.entries(machine)) {
      for (const target of Object.values(state.transitions || {})) {
        assert.ok(machine[target], `${name} -> ${target}`);
      }
    }
  });

  test(`${flow.id}: every bound field is in the schema, or its validation never runs`, () => {
    const bound = collectAssets(flow.views).filter((a) => a.binding);
    assert.ok(bound.length > 0);
    for (const asset of bound) assert.ok(schemaHasBinding(flow.schema, asset.binding), asset.binding);
  });

  test(`${flow.id}: asset ids are unique, or the player cannot tell assets apart`, () => {
    const ids = collectAssets(flow.views).map((a) => a.id);
    assert.equal(new Set(ids).size, ids.length);
  });
}
