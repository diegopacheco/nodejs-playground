import { prince } from "princejs";

const app = prince();
app.get("/", () => ({ message: "Hello!" }));
app.listen(3000);