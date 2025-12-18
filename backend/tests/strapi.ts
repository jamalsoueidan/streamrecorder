import type { Core } from "@strapi/strapi";
import { createStrapi } from "@strapi/strapi";
import fs from "fs";
import path from "path";
import { Client } from "pg";

let instance: Core.Strapi | null = null;

const TEST_DB_NAME = "streamrecorder_test";
const isCI = process.env.CI === "true";

// Set test environment
process.env.NODE_ENV = "test";
process.env.APP_KEYS = "testKeyOne,testKeyTwo";
process.env.API_TOKEN_SALT = "test-api-token-salt";
process.env.ADMIN_JWT_SECRET = "test-admin-jwt-secret";
process.env.TRANSFER_TOKEN_SALT = "test-transfer-token-salt";
process.env.JWT_SECRET = "test-jwt-secret";

async function createTestDatabase() {
  if (isCI) {
    // SQLite in CI - ensure .tmp directory exists
    const tmpDir = path.resolve(__dirname, "..", ".tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const dbPath = path.resolve(tmpDir, "test.db");
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    return;
  }

  // PostgreSQL locally
  const client = new Client({
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: "postgres",
  });

  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
  await client.query(`CREATE DATABASE ${TEST_DB_NAME}`);
  await client.end();
}

async function dropTestDatabase() {
  if (isCI) {
    const dbPath = path.resolve(__dirname, "..", ".tmp", "test.db");
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    return;
  }

  const client = new Client({
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: "postgres",
  });

  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
  await client.end();
}

export async function setupStrapi(): Promise<Core.Strapi> {
  if (!instance) {
    await createTestDatabase();

    instance = await createStrapi({
      appDir: path.resolve(__dirname, ".."),
      distDir: path.resolve(__dirname, "..", "dist"),
    }).load();

    await instance.start();
    global.strapi = instance;
  }
  return instance;
}

export function getServer() {
  return instance?.server.httpServer as any;
}

export async function cleanupStrapi(): Promise<void> {
  if (!instance) return;

  await instance.server.httpServer.close();
  await instance.db.connection.destroy();
  await instance.destroy();

  instance = null;
  await dropTestDatabase();
}
