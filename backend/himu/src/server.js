import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`HIMU Backend running on http://localhost:${env.port}`);
    console.log(`API base URL: http://localhost:${env.port}/api`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
