import type { Core } from "@strapi/strapi";
import { createStrapi } from "@strapi/strapi";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import request from "supertest";

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

export type RoleType = "authenticated" | "premium" | "champion" | "public";

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

/**
 * Get or create a role by type
 */
export async function getOrCreateRole(roleType: RoleType) {
  let role = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: roleType } });

  if (!role) {
    role = await strapi.db.query("plugin::users-permissions.role").create({
      data: {
        name: roleType.charAt(0).toUpperCase() + roleType.slice(1),
        description: `${roleType} role`,
        type: roleType,
      },
    });
  }

  return role;
}

/**
 * Grant permissions to a specific role
 */
export async function grantPermissions(
  actions: string[],
  roleType: RoleType = "authenticated"
) {
  const role = await getOrCreateRole(roleType);

  for (const action of actions) {
    // Check if permission already exists
    const existing = await strapi.db
      .query("plugin::users-permissions.permission")
      .findOne({
        where: { action, role: role.id },
      });

    if (!existing) {
      await strapi.db.query("plugin::users-permissions.permission").create({
        data: { action, role: role.id },
      });
    }
  }
}

/**
 * Create a test user with specified role
 * Permissions should be granted to the role before calling this
 */
export async function createTestUser(
  email: string,
  username: string,
  roleType: RoleType = "premium"
) {
  const role = await getOrCreateRole(roleType);

  // Create user with that role
  await strapi.plugins["users-permissions"].services.user.add({
    username,
    email,
    password: "password123",
    confirmed: true,
    blocked: false,
    provider: "local",
    role: role.id,
  });

  // Login and get JWT
  const res = await request(getServer())
    .post("/api/auth/local")
    .send({ identifier: email, password: "password123" });

  if (!res.body.jwt) {
    throw new Error(`Failed to get JWT for ${email}`);
  }

  return {
    jwt: res.body.jwt,
    user: res.body.user,
    role: role,
  };
}

/**
 * Convenience: Setup role with permissions and create user in one call
 */
export async function createTestUserWithPermissions(
  email: string,
  username: string,
  roleType: RoleType,
  permissions: string[]
) {
  await grantPermissions(permissions, roleType);
  return createTestUser(email, username, roleType);
}

export async function createRecording(
  followerId: number,
  options: { withSource?: boolean; sourceState?: string } = {}
) {
  const { withSource = false, sourceState = "done" } = options;

  if (withSource) {
    const source = await strapi.db.query("api::source.source").create({
      data: {
        path: "/test/video.mp4",
        state: sourceState,
        duration: 120,
        publishedAt: new Date(),
      },
    });

    return strapi.db.query("api::recording.recording").create({
      data: {
        follower: followerId,
        sources: [source.id],
        publishedAt: new Date(),
      },
    });
  }

  return strapi.db.query("api::recording.recording").create({
    data: {
      follower: followerId,
      publishedAt: new Date(),
    },
  });
}

// Build query string from nested object
export function buildQuery(params: Record<string, any>, prefix = ""): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (value === null || value === undefined) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      parts.push(buildQuery(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        parts.push(`${fullKey}[${i}]=${encodeURIComponent(v)}`);
      });
    } else {
      parts.push(`${fullKey}=${encodeURIComponent(value)}`);
    }
  }

  return parts.filter(Boolean).join("&");
}
