import { createApp } from "./server.js";
import { loadFlows } from "./flows.js";

const port = Number(process.env.PORT || 3011);

createApp(loadFlows()).listen(port, () => {
  console.log(`backend listening on http://localhost:${port}/api`);
});
