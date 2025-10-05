import { Application, Router } from "@oak/oak";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = { message: "Oak Server Running" };
});

router.get("/health", (ctx) => {
  ctx.response.body = { status: "healthy", timestamp: new Date().toISOString() };
});

router.post("/data", async (ctx) => {
  const body = await ctx.request.body.json();
  ctx.response.body = { received: body, processedAt: new Date().toISOString() };
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Oak server listening on http://localhost:8000");
await app.listen({ port: 8000 });
