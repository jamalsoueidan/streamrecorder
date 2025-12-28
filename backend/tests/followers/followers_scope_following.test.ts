import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import {
  buildQuery,
  cleanupStrapi,
  createRecording,
  createTestUser,
  getServer,
  grantPermissions,
  setupStrapi,
} from "../strapi";

jest.setTimeout(30000);

let jwt: string;
const followers: any[] = [];

async function followStreamer(username: string, type = "tiktok") {
  const res = await request(getServer())
    .post("/api/followers/follow")
    .set("Authorization", `Bearer ${jwt}`)
    .send({ username, type });

  return res.body.data;
}

beforeAll(async () => {
  await setupStrapi();

  await grantPermissions([
    "api::follower.follower.browse",
    "api::follower.follower.follow",
    "api::recording.recording.find",
    "api::source.source.find",
  ]);

  const { jwt: userJwt } = await createTestUser("user@test.com", "testuser");
  jwt = userJwt;

  // Create 5 followers
  const names = ["alice", "bob", "charlie", "david", "eve"];

  for (const name of names) {
    const follower = await followStreamer(name, "tiktok");
    followers.push(follower);
  }

  // alice - has recording with valid source
  const alice = followers.find((f) => f.username === "alice");
  await createRecording(alice.id, { withSource: true, sourceState: "done" });

  // bob - has recording with failed source
  const bob = followers.find((f) => f.username === "bob");
  await createRecording(bob.id, { withSource: true, sourceState: "failed" });

  // charlie, david, eve - no recordings
});

afterAll(async () => {
  await cleanupStrapi();
});

describe("Followers Browse (scope=following)", () => {
  describe("Sorting", () => {
    it("should sort by username:asc", async () => {
      const query = buildQuery({ scope: "following", sort: "username:asc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toEqual(["alice", "bob", "charlie", "david", "eve"]);
    });

    it("should sort by username:desc", async () => {
      const query = buildQuery({ scope: "following", sort: "username:desc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toEqual(["eve", "david", "charlie", "bob", "alice"]);
    });

    it("should sort by createdAt:asc", async () => {
      const query = buildQuery({ scope: "following", sort: "createdAt:asc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // First created should be alice (created first in loop)
      expect(res.body.data[0].username).toBe("alice");
    });

    it("should sort by createdAt:desc", async () => {
      const query = buildQuery({ scope: "following", sort: "createdAt:desc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // Last created should be eve (created last in loop)
      expect(res.body.data[0].username).toBe("eve");
    });
  });

  describe("hasRecordings filter", () => {
    it("should return all followers when hasRecordings is not set", async () => {
      const query = buildQuery({ scope: "following" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(5);
    });

    it("should return only followers with valid recordings", async () => {
      const query = buildQuery({ scope: "following", hasRecordings: "true" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // Only alice has recording with valid source
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].username).toBe("alice");
    });
  });

  describe("Populate", () => {
    it("should populate recordings with sources", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        populate: {
          recordings: {
            populate: {
              sources: { fields: ["*"] },
            },
          },
        },
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const alice = res.body.data.find((f: any) => f.username === "alice");
      expect(alice.recordings).toHaveLength(1);
      expect(alice.recordings[0].sources).toHaveLength(1);
      expect(alice.recordings[0].sources[0].state).toBe("done");
    });

    it("should filter out failed sources", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        populate: {
          recordings: {
            populate: {
              sources: {
                fields: ["*"],
                filters: { state: { $ne: "failed" } },
              },
            },
          },
        },
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // Alice should have recording with valid source
      const alice = res.body.data.find((f: any) => f.username === "alice");
      expect(alice.recordings).toHaveLength(1);
      expect(alice.recordings[0].sources).toHaveLength(1);
      expect(alice.recordings[0].sources[0].state).toBe("done");
    });
  });
});
