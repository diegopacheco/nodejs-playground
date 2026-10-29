import { createServer } from "node:http";

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}");
}

function invalidSubmission(body, flows) {
  if (!flows.has(body.flowId)) return "unknown flowId";
  if (typeof body.outcome !== "string" || body.outcome === "") return "outcome is required";
  if (typeof body.data !== "object" || body.data === null) return "data must be an object";
  return null;
}

export function createApp(flows) {
  const submissions = [];

  return createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");
    const flowMatch = pathname.match(/^\/api\/flows\/([\w-]+)$/);

    if (req.method === "GET" && pathname === "/api/flows") {
      return send(res, 200, [...flows.values()].map(({ id, title }) => ({ id, title })));
    }

    if (req.method === "GET" && flowMatch) {
      const flow = flows.get(flowMatch[1]);
      return flow ? send(res, 200, flow) : send(res, 404, { error: "flow not found" });
    }

    if (req.method === "GET" && pathname === "/api/submissions") {
      return send(res, 200, submissions);
    }

    if (req.method === "POST" && pathname === "/api/submissions") {
      let body;
      try {
        body = await readJson(req);
      } catch {
        return send(res, 400, { error: "invalid json" });
      }
      const error = invalidSubmission(body, flows);
      if (error) return send(res, 400, { error });
      const submission = {
        id: submissions.length + 1,
        flowId: body.flowId,
        outcome: body.outcome,
        data: body.data,
        at: new Date().toISOString(),
      };
      submissions.push(submission);
      return send(res, 201, submission);
    }

    send(res, 404, { error: "not found" });
  });
}
