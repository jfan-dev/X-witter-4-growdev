import app from "./app.js";

const port = Number(process.env.PORT) || 3002;
const host = process.env.HOST || "0.0.0.0";
const url = `http://localhost:${port}`;

app.listen(port, host, () => {
  console.log("\n==========================================================================================");
  console.log(`🚀 Server running at ${url} 👈 Ctrl+Click the open!!!`);
  console.log("==========================================================================================\n");
});