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
    {
      action: "api::follower.follower.findForUser",
      role: authenticatedRole.id,
    },
    {
      action: "api::follower.follower.findNotFollowing",
      role: authenticatedRole.id,
    },
    { action: "api::follower.follower.follow", role: authenticatedRole.id },
    { action: "api::follower.follower.unfollow", role: authenticatedRole.id },
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

// Helper - now much simpler with bidirectional relations!
async function createRecording(followerIdNum: number, withSource = false) {
  const recording = await strapi.db.query("api::recording.recording").create({
    data: {
      follower: followerIdNum,
      publishedAt: new Date(),
    },
  });

  if (withSource) {
    const source = await strapi.db.query("api::source.source").create({
      data: {
        path: "https://example.com/video.mp4",
        recording: recording.id,
        publishedAt: new Date(),
      },
    });
  }

  // Verify the relation was created
  const verify = await strapi.db.query("api::recording.recording").findOne({
    where: { id: recording.id },
    populate: ["follower", "sources"],
  });

  return recording;
}

describe("Follower API", () => {
  describe("Follow", () => {
    it("should follow a user", async () => {
      const res = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", slug: "tiktoker", type: "tiktok" })
        .expect(200);

      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("documentId");
      followerId = res.body.data.id;
    });

    it("should not duplicate when following same user twice", async () => {
      const res = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", slug: "tiktoker", type: "tiktok" })
        .expect(200);

      expect(res.body.data.id).toBe(followerId);
    });
  });

  describe("Get Followers (findForUser)", () => {
    it("should return empty array when no followers", async () => {
      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt2}`)
        .expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.meta).toHaveProperty("pagination");
      expect(res.body.meta.pagination.total).toBe(0);
    });

    it("should get my followers with correct fields", async () => {
      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty("id");
      expect(res.body.data[0]).toHaveProperty("username", "tiktoker");
      expect(res.body.data[0]).toHaveProperty("slug", "tiktoker");
      expect(res.body.data[0]).toHaveProperty("totalRecordings");
      expect(res.body.data[0]).toHaveProperty("recordings");
      expect(res.body.meta.pagination.total).toBe(1);
    });

    it("should return totalRecordings as 0 when no recordings", async () => {
      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].totalRecordings).toBe(0);
      expect(res.body.data[0].recordings).toEqual([]);
    });

    it("should return recordings with sources", async () => {
      await createRecording(followerId, true);

      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].totalRecordings).toBe(1);
      expect(res.body.data[0].recordings).toHaveLength(1);
      expect(res.body.data[0].recordings[0]).toHaveProperty("id");
      expect(res.body.data[0].recordings[0].sources).toHaveLength(1);
      expect(res.body.data[0].recordings[0].sources[0]).toHaveProperty(
        "path",
        "https://example.com/video.mp4"
      );
    });

    it("should return max 5 recordings even if more exist", async () => {
      // Create 6 more recordings (7 total)
      for (let i = 0; i < 6; i++) {
        await createRecording(followerId);
      }

      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].totalRecordings).toBe(7);
      expect(res.body.data[0].recordings).toHaveLength(5);
    });

    it("should return recordings sorted by createdAt desc (newest first)", async () => {
      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const recordings = res.body.data[0].recordings;

      for (let i = 0; i < recordings.length - 1; i++) {
        const current = new Date(recordings[i].createdAt);
        const next = new Date(recordings[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it("should NOT see other users followers or recordings", async () => {
      const res1 = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt2}`)
        .send({
          username: "other_tiktoker",
          slug: "other_tiktoker",
          type: "tiktok",
        })
        .expect(200);

      const otherFollowerId = res1.body.data.id;

      await createRecording(otherFollowerId);

      const res2 = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res2.body.data).toHaveLength(1);
      expect(res2.body.data[0].username).toBe("tiktoker");
      expect(
        res2.body.data.some((f: any) => f.username === "other_tiktoker")
      ).toBe(false);
    });

    it("should support pagination", async () => {
      // User 1 follows multiple accounts
      for (let i = 1; i <= 5; i++) {
        await request(getServer())
          .post("/api/followers/follow")
          .set("Authorization", `Bearer ${jwt}`)
          .send({
            username: `streamer${i}`,
            slug: `streamer${i}`,
            type: "tiktok",
          })
          .expect(200);
      }

      // Get first page (pageSize=2)
      const page1 = await request(getServer())
        .get("/api/followers/for-user?page=1&pageSize=2")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(page1.body.data).toHaveLength(2);
      expect(page1.body.meta.pagination).toEqual({
        page: 1,
        pageSize: 2,
        pageCount: 3, // 6 total (tiktoker + 5 new) / 2 = 3
        total: 6,
      });

      // Get second page
      const page2 = await request(getServer())
        .get("/api/followers/for-user?page=2&pageSize=2")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(page2.body.data).toHaveLength(2);
      expect(page2.body.meta.pagination.page).toBe(2);

      // Get last page
      const page3 = await request(getServer())
        .get("/api/followers/for-user?page=3&pageSize=2")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(page3.body.data).toHaveLength(2);
      expect(page3.body.meta.pagination.page).toBe(3);
    });
  });

  describe("Get Not Following (findNotFollowing)", () => {
    it("should return all followers when user follows no one", async () => {
      // Create a new user who follows nobody
      await strapi.plugins["users-permissions"].services.user.add({
        username: "newuser",
        email: "newuser@test.com",
        password: "password123",
        confirmed: true,
        blocked: false,
        provider: "local",
        role: authenticatedRole.id,
      });

      const loginRes = await request(getServer())
        .post("/api/auth/local")
        .send({ identifier: "newuser@test.com", password: "password123" });

      const newUserJwt = loginRes.body.jwt;

      const res = await request(getServer())
        .get("/api/followers/not-following")
        .set("Authorization", `Bearer ${newUserJwt}`)
        .expect(200);

      // Should see all followers created in other tests
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta).toHaveProperty("pagination");
    });

    it("should exclude followers user is already following", async () => {
      const res = await request(getServer())
        .get("/api/followers/not-following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // User 1 follows "tiktoker", so it should NOT be in the list
      const followingTiktoker = res.body.data.some(
        (f: any) => f.slug === "tiktoker"
      );
      expect(followingTiktoker).toBe(false);
    });

    it("should return followers with recordings", async () => {
      const res = await request(getServer())
        .get("/api/followers/not-following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty("totalRecordings");
        expect(res.body.data[0]).toHaveProperty("recordings");
      }
    });

    it("should support pagination", async () => {
      const res = await request(getServer())
        .get("/api/followers/not-following?page=1&pageSize=2")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.pagination).toHaveProperty("page", 1);
      expect(res.body.meta.pagination).toHaveProperty("pageSize", 2);
      expect(res.body.meta.pagination).toHaveProperty("pageCount");
      expect(res.body.meta.pagination).toHaveProperty("total");
    });
  });

  describe("Unfollow", () => {
    it("should unfollow", async () => {
      await request(getServer())
        .delete(`/api/followers/unfollow/${followerId}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);
    });

    it("should NOT have tiktoker after unfollow", async () => {
      const res = await request(getServer())
        .get("/api/followers/for-user")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // Check tiktoker is not in the list anymore
      const hasTiktoker = res.body.data.some((f: any) => f.slug === "tiktoker");
      expect(hasTiktoker).toBe(false);
    });

    it("should NOT be able to unfollow someone you dont follow", async () => {
      await request(getServer())
        .delete(`/api/followers/unfollow/99999`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(404);
    });
  });
});
