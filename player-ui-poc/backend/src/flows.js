import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FLOWS_DIR = new URL("../flows/", import.meta.url).pathname;

export function loadFlows(dir = FLOWS_DIR) {
  const flows = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const flow = JSON.parse(readFileSync(join(dir, file), "utf8"));
    flows.set(flow.id, flow);
  }
  return flows;
}
