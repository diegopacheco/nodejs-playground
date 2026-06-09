import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

export function startStaticServer(root: string, port: number): Promise<Server> {
  const server = createServer(async (req, res) => {
    const requested = normalize(decodeURIComponent((req.url ?? "/").split("?")[0] ?? "/"));
    try {
      const file = await readFile(join(root, requested));
      res.writeHead(200, { "Content-Type": mimeTypes[extname(requested)] ?? "application/octet-stream" });
      res.end(file);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}
