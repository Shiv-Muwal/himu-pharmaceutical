import mongoose from "mongoose";
import { env } from "./env.js";

let memoryServer = null;

export async function connectDB() {
  mongoose.set("strictQuery", true);

  let uri = env.mongoUri;

  if (env.useMemoryDb) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri("himu-pharmacy");
    console.log("Using in-memory MongoDB");
  }

  try {
    await mongoose.connect(uri);
  } catch (error) {
    if (env.nodeEnv === "production" || env.useMemoryDb) {
      throw error;
    }

    console.warn(
      `MongoDB unavailable (${error.message}). Falling back to in-memory database.`,
    );
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri("himu-pharmacy");
    await mongoose.connect(uri);
    console.log("Using in-memory MongoDB fallback");
  }

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

export function isMemoryDb() {
  return Boolean(memoryServer);
}
