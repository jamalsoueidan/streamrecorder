import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import { cleanupStrapi, getServer, setupStrapi } from "./strapi";

jest.setTimeout(30000);

let jwt: string;
let jwt2: string;
let followerId: number;
let authenticatedRole: any;

beforeAll(async () => {
  await setupStrapi();

  authenticatedRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "authenticated" } });

  // Grant permissions
  const permissionsToCreate = [
    { action: "api::follower.follower.find", role: authenticatedRole.id },
    { action: "api::follower.follower.follow", role: authenticatedRole.id },
    { action: "api::follower.follower.unfollow", role: authenticatedRole.id },
    { action: "api::recording.recording.find", role: authenticatedRole.id },
    { action: "api::recording.recording.browse", role: authenticatedRole.id },
    { action: "api::source.source.find", role: authenticatedRole.id },
  ];

  for (const perm of permissionsToCreate) {
    await strapi.db.query("plugin::users-permissions.permission").create({
      data: perm,
    });
  }

  // Create user 1
  await strapi.plugins["users-permissions"].services.user.add({
    username: "testuser1",
    email: "test1@test.com",
    password: "password123",
    confirmed: true,
    blocked: false,
    provider: "local",
    role: authenticatedRole.id,
  });

  // Create user 2
  await strapi.plugins["users-permissions"].services.user.add({
    username: "testuser2",
    email: "test2@test.com",
    password: "password123",
    confirmed: true,
    blocked: false,
    provider: "local",
    role: authenticatedRole.id,
  });

  // Login user 1
  const res1 = await request(getServer())
    .post("/api/auth/local")
    .send({ identifier: "test1@test.com", password: "password123" });
  jwt = res1.body.jwt;

  // Login user 2
  const res2 = await request(getServer())
    .post("/api/auth/local")
    .send({ identifier: "test2@test.com", password: "password123" });
  jwt2 = res2.body.jwt;

  if (!jwt || !jwt2) {
    throw new Error("Failed to get JWT tokens");
  }
}, 30000);

afterAll(async () => {
  await cleanupStrapi();
}, 30000);

// Helper to create a recording
async function createRecording(followerIdNum: number, withSource = false) {
  let recording;

  if (withSource) {
    const response = await strapi.db.query("api::source.source").create({
      data: {
        path: "https://example.com/video.mp4",
        duration: 12,
        publishedAt: new Date(),
      },
    });

    let sourceIdNum = response.id;

    recording = await strapi.db.query("api::recording.recording").create({
      data: {
        follower: followerIdNum,
        sources: [sourceIdNum],
        publishedAt: new Date(),
      },
    });
  } else {
    recording = await strapi.db.query("api::recording.recording").create({
      data: {
        follower: followerIdNum,
        publishedAt: new Date(),
      },
    });
  }

  return recording;
}

describe("Recording API", () => {
  describe("Get Recordings (find)", () => {
    it("should require authentication", async () => {
      await request(getServer())
        .get("/api/recordings/browse?scope=following")
        .expect(403);
    });

    it("should return empty array when user has no followers", async () => {
      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toEqual([]);
    });

    it("should return empty array when followers have no recordings", async () => {
      // User 1 follows someone
      await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", type: "tiktok" })
        .expect(200);

      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toEqual([]);
    });

    it("should return recordings for user's followers", async () => {
      // Get the follower id
      const followRes = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", type: "tiktok" })
        .expect(200);

      followerId = followRes.body.data.id;

      // Create a recording
      await createRecording(followerId);

      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following&populate=*")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty("id");
      expect(res.body.data[0]).toHaveProperty("documentId");
      expect(res.body.data[0]).toHaveProperty("createdAt");
    });

    it("should return recordings with sources populated", async () => {
      await createRecording(followerId, true);

      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following&populate=sources")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      console.log(res.body.data);

      // Find recording with sources
      const recordingWithSources = res.body.data.find(
        (r: any) => r.sources && r.sources.length > 0
      );

      expect(recordingWithSources).toBeDefined();
      expect(recordingWithSources.sources[0]).toHaveProperty("path");
    });

    it("should return recordings with follower populated", async () => {
      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following&populate=follower")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].follower).toHaveProperty("id");
      expect(res.body.data[0].follower).toHaveProperty("username", "tiktoker");
    });

    it("should return recordings sorted by createdAt desc (newest first)", async () => {
      // Create a few more recordings
      for (let i = 0; i < 3; i++) {
        await createRecording(followerId);
      }

      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following&sort=createdAt:desc")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const recordings = res.body.data;

      for (let i = 0; i < recordings.length - 1; i++) {
        const current = new Date(recordings[i].createdAt);
        const next = new Date(recordings[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it("should limit to 20 recordings", async () => {
      // Create 25 total recordings
      for (let i = 0; i < 20; i++) {
        await createRecording(followerId);
      }

      const res = await request(getServer())
        .get("/api/recordings/browse?scope=following&pagination[pageSize]=20")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(20);
    });

    it("should NOT return recordings from followers user doesn't follow", async () => {
      // User 2 follows a different account
      const res1 = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt2}`)
        .send({
          username: "other_tiktoker",
          type: "tiktok",
        })
        .expect(200);

      const otherFollowerId = res1.body.data.id;

      // Create recording for user 2's follower
      await createRecording(otherFollowerId);

      // User 1 should NOT see this recording
      const res2 = await request(getServer())
        .get("/api/recordings/browse?scope=following&populate=follower")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // All recordings should be from "tiktoker", not "other_tiktoker"
      const hasOtherFollower = res2.body.data.some(
        (r: any) =>
          r.follower?.username === "other_tiktoker" &&
          r.follower?.type === "tiktok"
      );

      expect(hasOtherFollower).toBe(false);
    });
  });
});
