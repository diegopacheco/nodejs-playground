import { prince } from "princejs";

export const app = prince();
app.get("/", () => ({ message: "Hello!" }));

if (import.meta.main) {
  app.listen(3000);
}