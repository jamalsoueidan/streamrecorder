import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import { cleanupStrapi, getServer, setupStrapi } from "./strapi";

jest.setTimeout(30000); // 30 seconds timeout

let jwt: string;
let followerId: number;

beforeAll(async () => {
  await setupStrapi();

  // Get the authenticated role
  const authenticatedRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({
      where: { type: "authenticated" },
    });

  // Check what actions are available
  const allPermissions = await strapi.db
    .query("plugin::users-permissions.permission")
    .findMany({});
  console.log(
    "Existing permissions:",
    allPermissions.map((p) => p.action)
  );

  // Try to find the correct action names
  const actions =
    (await strapi.contentAPI?.permissions?.providers?.action?.keys()) || [];
  console.log("Available actions:", Array.from(actions));

  // Grant permissions for our custom routes
  const permissionsToCreate = [
    {
      action: "api::follower.follower.findForUser",
      role: authenticatedRole.id,
    },
    { action: "api::follower.follower.follow", role: authenticatedRole.id },
    { action: "api::follower.follower.unfollow", role: authenticatedRole.id },
  ];

  for (const perm of permissionsToCreate) {
    try {
      await strapi.db.query("plugin::users-permissions.permission").create({
        data: perm,
      });
      console.log(`Created permission: ${perm.action}`);
    } catch (error) {
      console.log(`Failed to create permission: ${perm.action}`, error.message);
    }
  }

  // Verify permissions were created
  const createdPerms = await strapi.db
    .query("plugin::users-permissions.permission")
    .findMany({
      where: { role: authenticatedRole.id },
    });
  console.log(
    "Permissions for authenticated role:",
    createdPerms.map((p) => p.action)
  );

  // Create test user
  await strapi.plugins["users-permissions"].services.user.add({
    username: "testuser",
    email: "test@test.com",
    password: "password123",
    confirmed: true,
    blocked: false,
    provider: "local",
    role: authenticatedRole.id,
  });

  // Login
  const res = await request(getServer())
    .post("/api/auth/local")
    .send({ identifier: "test@test.com", password: "password123" });

  jwt = res.body.jwt;

  if (!jwt) {
    console.log("Login failed:", res.body);
    throw new Error("Failed to get JWT token");
  }
}, 30000);

afterAll(async () => {
  await cleanupStrapi();
}, 30000);

describe("Follower API", () => {
  it("should follow a user", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "tiktoker", slug: "tiktoker", type: "tiktok" })
      .expect(200);

    expect(res.body.data).toHaveProperty("id");
    followerId = res.body.data.id;
  });

  it("should get my followers", async () => {
    const res = await request(getServer())
      .get("/api/followers/for-user")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    expect(res.body.data.some((f: any) => f.id === followerId)).toBe(true);
  });

  it("should unfollow", async () => {
    await request(getServer())
      .delete(`/api/followers/unfollow/${followerId}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);
  });
});
