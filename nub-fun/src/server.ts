import express, { type Request, type Response } from "express";

interface Note {
  id: number;
  text: string;
  at: string;
}

const app = express();
const port = Number(process.env.PORT ?? 3000);
const startedAt = Date.now();

let nextId = 1;
const notes: Note[] = [];

app.use(express.json());
app.use(express.static(new URL("./public", import.meta.url).pathname));

app.get("/api/info", (_req: Request, res: Response) => {
  res.json({
    runtime: "nub",
    language: "TypeScript (no build step)",
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
    pid: process.pid,
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  });
});

app.get("/api/notes", (_req: Request, res: Response) => {
  res.json(notes);
});

app.post("/api/notes", (req: Request, res: Response) => {
  const text = String(req.body?.text ?? "").trim();
  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }
  const note: Note = { id: nextId++, text, at: new Date().toISOString() };
  notes.unshift(note);
  res.status(201).json(note);
});

app.delete("/api/notes", (_req: Request, res: Response) => {
  notes.length = 0;
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`nub-fun running on http://localhost:${port}`);
});
