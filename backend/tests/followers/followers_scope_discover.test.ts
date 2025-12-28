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
let jwt2: string;
const followers: any[] = [];

async function followStreamer(
  token: string,
  username: string,
  type = "tiktok"
) {
  const res = await request(getServer())
    .post("/api/followers/follow")
    .set("Authorization", `Bearer ${token}`)
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

  // User 1 - will use discover
  const { jwt: userJwt } = await createTestUser("user@test.com", "testuser");
  jwt = userJwt;

  // User 2 - will follow streamers (so they exist in DB)
  const { jwt: userJwt2 } = await createTestUser("user2@test.com", "testuser2");
  jwt2 = userJwt2;

  // User 2 follows 5 streamers (User 1 does NOT follow them = discover)
  const names = ["alice", "bob", "charlie", "david", "eve"];

  for (const name of names) {
    const follower = await followStreamer(jwt2, name, "tiktok");
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

describe("Followers Browse (scope=discover)", () => {
  describe("Sorting", () => {
    it("should sort by username:asc", async () => {
      const query = buildQuery({ scope: "discover", sort: "username:asc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toEqual(["alice", "bob", "charlie", "david", "eve"]);
    });

    it("should sort by username:desc", async () => {
      const query = buildQuery({ scope: "discover", sort: "username:desc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toEqual(["eve", "david", "charlie", "bob", "alice"]);
    });

    it("should sort by createdAt:asc", async () => {
      const query = buildQuery({ scope: "discover", sort: "createdAt:asc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].username).toBe("alice");
    });

    it("should sort by createdAt:desc", async () => {
      const query = buildQuery({ scope: "discover", sort: "createdAt:desc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].username).toBe("eve");
    });
  });

  describe("hasRecordings filter", () => {
    it("should return only followers with recordings", async () => {
      const query = buildQuery({ scope: "discover", hasRecordings: "true" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("alice");
      expect(usernames).not.toContain("bob");
      expect(usernames).not.toContain("charlie");
      expect(usernames).not.toContain("david");
      expect(usernames).not.toContain("eve");
    });
  });

  describe("Populate", () => {
    it("should populate recordings with sources", async () => {
      const query = buildQuery({
        scope: "discover",
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
        scope: "discover",
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

      const alice = res.body.data.find((f: any) => f.username === "alice");
      expect(alice.recordings).toHaveLength(1);

      const allSources = res.body.data.flatMap((f: any) =>
        (f.recordings || []).flatMap((r: any) => r.sources || [])
      );
      const failedSources = allSources.filter((s: any) => s.state === "failed");
      expect(failedSources).toHaveLength(0);
    });

    it("should have isFollowing=false for all", async () => {
      const query = buildQuery({ scope: "discover" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      res.body.data.forEach((f: any) => {
        expect(f.isFollowing).toBe(false);
      });
    });
  });
});
