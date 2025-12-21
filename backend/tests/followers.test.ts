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
    { action: "api::follower.follower.browse", role: authenticatedRole.id },
    { action: "api::follower.follower.follow", role: authenticatedRole.id },
    { action: "api::follower.follower.unfollow", role: authenticatedRole.id },
    { action: "api::recording.recording.find", role: authenticatedRole.id },
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

describe("Follower API", () => {
  describe("Follow", () => {
    it("should follow a user", async () => {
      const res = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", type: "tiktok" })
        .expect(200);

      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("documentId");
      followerId = res.body.data.id;
    });

    it("should not duplicate when following same user twice", async () => {
      const res = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "tiktoker", type: "tiktok" })
        .expect(200);

      expect(res.body.data.id).toBe(followerId);
    });
  });

  describe("Get Followers (scope=following)", () => {
    it("should return empty array when no followers", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse?scope=following")
        .set("Authorization", `Bearer ${jwt2}`)
        .expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.meta).toHaveProperty("pagination");
      expect(res.body.meta.pagination.total).toBe(0);
    });

    it("should get my followers with correct fields", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse?scope=following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty("id");
      expect(res.body.data[0]).toHaveProperty("username", "tiktoker");
      expect(res.body.data[0]).toHaveProperty("totalRecordings");
      expect(res.body.data[0]).toHaveProperty("isFollowing", true);
      expect(res.body.meta.pagination.total).toBe(1);
    });

    it("should return recordings with sources when populated", async () => {
      await createRecording(followerId, true);

      const res = await request(getServer())
        .get(
          "/api/followers/browse?scope=following&populate[recordings][populate]=sources"
        )
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

    it("should NOT see other users followers", async () => {
      const res1 = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt2}`)
        .send({
          username: "other_tiktoker",
          type: "tiktok",
        })
        .expect(200);

      const res2 = await request(getServer())
        .get("/api/followers/browse?scope=following")
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
            type: "tiktok",
          })
          .expect(200);
      }

      const page1 = await request(getServer())
        .get(
          "/api/followers/browse?scope=following&pagination[page]=1&pagination[pageSize]=2"
        )
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(page1.body.data).toHaveLength(2);
      expect(page1.body.meta.pagination).toMatchObject({
        page: 1,
        pageSize: 2,
        total: 6,
      });

      const page2 = await request(getServer())
        .get(
          "/api/followers/browse?scope=following&pagination[page]=2&pagination[pageSize]=2"
        )
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(page2.body.data).toHaveLength(2);
      expect(page2.body.meta.pagination.page).toBe(2);
    });
  });

  describe("Get Followers (hasRecordings filter)", () => {
    let followerWithRecordings: number;
    let followerWithoutRecordings: number;

    beforeAll(async () => {
      // Create a follower WITH recordings
      const res1 = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "has_recordings", type: "tiktok" });
      followerWithRecordings = res1.body.data.id;
      await createRecording(followerWithRecordings, true);

      // Create a follower WITHOUT recordings
      const res2 = await request(getServer())
        .post("/api/followers/follow")
        .set("Authorization", `Bearer ${jwt}`)
        .send({ username: "no_recordings", type: "tiktok" });
      followerWithoutRecordings = res2.body.data.id;
    });

    it("should return only followers with recordings when hasRecordings=true", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse?hasRecordings=true")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("has_recordings");
      expect(usernames).not.toContain("no_recordings");

      // All returned followers should have recordings
      res.body.data.forEach((f: any) => {
        expect(f.totalRecordings).toBeGreaterThan(0);
      });
    });

    it("should return all followers when hasRecordings is not set", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("has_recordings");
      expect(usernames).toContain("no_recordings");
    });

    it("should work with scope=following", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse?scope=following&hasRecordings=true")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("has_recordings");
      expect(usernames).not.toContain("no_recordings");

      // All should be following
      res.body.data.forEach((f: any) => {
        expect(f.isFollowing).toBe(true);
      });
    });

    it("should work with scope=discover", async () => {
      // Create a follower with recordings that user doesn't follow
      const discoverFollower = await strapi.db
        .query("api::follower.follower")
        .create({
          data: {
            username: "discover_with_recordings",
            type: "tiktok",
            slug: "discover_with_recordings",
            publishedAt: new Date(),
          },
        });
      await createRecording(discoverFollower.id, true);

      const res = await request(getServer())
        .get("/api/followers/browse?scope=discover&hasRecordings=true")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("discover_with_recordings");

      // None should be following
      res.body.data.forEach((f: any) => {
        expect(f.isFollowing).toBe(false);
        expect(f.totalRecordings).toBeGreaterThan(0);
      });
    });

    it("should work with populate", async () => {
      const res = await request(getServer())
        .get(
          "/api/followers/browse?hasRecordings=true&populate[recordings][populate]=sources"
        )
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const follower = res.body.data.find(
        (f: any) => f.username === "has_recordings"
      );
      expect(follower).toBeDefined();
      expect(follower.recordings.length).toBeGreaterThan(0);
      expect(follower.recordings[0].sources.length).toBeGreaterThan(0);
    });

    it("should support pagination with hasRecordings", async () => {
      const res = await request(getServer())
        .get(
          "/api/followers/browse?hasRecordings=true&pagination[page]=1&pagination[pageSize]=1"
        )
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.pagination).toMatchObject({
        page: 1,
        pageSize: 1,
      });
      expect(res.body.meta.pagination.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Get Not Following (scope=discover)", () => {
    it("should return all followers when user follows no one", async () => {
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
        .get("/api/followers/browse?scope=discover")
        .set("Authorization", `Bearer ${newUserJwt}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta).toHaveProperty("pagination");
    });

    it("should exclude followers user is already following", async () => {
      const res = await request(getServer())
        .get("/api/followers/browse?scope=discover")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const followingTiktoker = res.body.data.some(
        (f: any) => f.username === "tiktoker" && f.type === "tiktok"
      );
      expect(followingTiktoker).toBe(false);
    });

    it("should support pagination", async () => {
      const res = await request(getServer())
        .get(
          "/api/followers/browse?scope=discover&pagination[page]=1&pagination[pageSize]=2"
        )
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.pagination).toHaveProperty("page", 1);
      expect(res.body.meta.pagination).toHaveProperty("pageSize", 2);
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
        .get("/api/followers/browse?scope=following")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

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
