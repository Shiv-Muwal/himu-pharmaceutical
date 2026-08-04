import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureSeeded } from "./seed/seed.js";

async function start() {
  await connectDB();

  if (env.autoSeed) {
    await ensureSeeded();
  }

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`HIMU Backend running on http://0.0.0.0:${env.port}`);
    console.log(`API base URL: http://localhost:${env.port}/api`);
    console.log(`CORS origins: ${env.clientUrls.join(", ")}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
