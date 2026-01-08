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

  await grantPermissions(
    [
      "api::follower.follower.browse",
      "api::follower.follower.follow",
      "api::recording.recording.find",
      "api::source.source.find",
    ],
    "premium"
  );

  const { jwt: userJwt } = await createTestUser(
    "user@test.com",
    "testuser",
    "premium"
  );
  jwt = userJwt;

  // Create 5 followers with different recording scenarios
  const names = ["alice", "bob", "charlie", "david", "eve"];

  for (const name of names) {
    const follower = await followStreamer(name, "tiktok");
    followers.push(follower);
  }

  // alice - 3 recordings with valid sources
  const alice = followers.find((f) => f.username === "alice");
  await createRecording(alice.id, { withSource: true, sourceState: "done" });
  await createRecording(alice.id, { withSource: true, sourceState: "done" });
  await createRecording(alice.id, { withSource: true, sourceState: "done" });

  // bob - 1 recording with failed source (should NOT count)
  const bob = followers.find((f) => f.username === "bob");
  await createRecording(bob.id, { withSource: true, sourceState: "failed" });

  // charlie - 2 recordings with valid sources
  const charlie = followers.find((f) => f.username === "charlie");
  await createRecording(charlie.id, { withSource: true, sourceState: "done" });
  await createRecording(charlie.id, { withSource: true, sourceState: "done" });

  // david - 1 recording with valid source
  const david = followers.find((f) => f.username === "david");
  await createRecording(david.id, { withSource: true, sourceState: "done" });

  // eve - no recordings
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

      expect(res.body.data[0].username).toBe("alice");
    });

    it("should sort by createdAt:desc", async () => {
      const query = buildQuery({ scope: "following", sort: "createdAt:desc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data[0].username).toBe("eve");
    });

    it("should sort by totalRecordings:desc", async () => {
      const query = buildQuery({
        scope: "following",
        sort: "totalRecordings:desc",
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const data = res.body.data;

      // alice: 3, charlie: 2, david: 1, bob: 0 (failed), eve: 0
      expect(data[0].username).toBe("alice");
      expect(data[0].totalRecordings).toBe(3);

      expect(data[1].username).toBe("charlie");
      expect(data[1].totalRecordings).toBe(2);

      expect(data[2].username).toBe("david");
      expect(data[2].totalRecordings).toBe(1);

      // bob and eve both have 0, order by id as tiebreaker
      const lastTwo = [data[3].username, data[4].username];
      expect(lastTwo).toContain("bob");
      expect(lastTwo).toContain("eve");
      expect(data[3].totalRecordings).toBe(0);
      expect(data[4].totalRecordings).toBe(0);
    });

    it("should sort by totalRecordings:asc", async () => {
      const query = buildQuery({
        scope: "following",
        sort: "totalRecordings:asc",
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const data = res.body.data;

      // bob and eve have 0, then david: 1, charlie: 2, alice: 3
      expect(data[data.length - 1].username).toBe("alice");
      expect(data[data.length - 1].totalRecordings).toBe(3);
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

    it("should return only followers with valid recordings when hasRecordings=true", async () => {
      const query = buildQuery({ scope: "following", hasRecordings: "true" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // alice, charlie, david have valid recordings
      // bob only has failed, eve has none
      expect(res.body.data).toHaveLength(3);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toContain("alice");
      expect(usernames).toContain("charlie");
      expect(usernames).toContain("david");
      expect(usernames).not.toContain("bob");
      expect(usernames).not.toContain("eve");
    });

    it("should NOT count recordings with only failed sources", async () => {
      const query = buildQuery({ scope: "following", hasRecordings: "true" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      // bob should NOT be in the list
      const bob = res.body.data.find((f: any) => f.username === "bob");
      expect(bob).toBeUndefined();
    });
  });

  describe("hasRecordings + sorting combined", () => {
    it("should filter by hasRecordings AND sort by totalRecordings:desc", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        sort: "totalRecordings:desc",
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(3);

      // Should be sorted: alice (3), charlie (2), david (1)
      expect(res.body.data[0].username).toBe("alice");
      expect(res.body.data[0].totalRecordings).toBe(3);

      expect(res.body.data[1].username).toBe("charlie");
      expect(res.body.data[1].totalRecordings).toBe(2);

      expect(res.body.data[2].username).toBe("david");
      expect(res.body.data[2].totalRecordings).toBe(1);
    });

    it("should filter by hasRecordings AND sort by totalRecordings:asc", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        sort: "totalRecordings:asc",
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(3);

      // Should be sorted: david (1), charlie (2), alice (3)
      expect(res.body.data[0].username).toBe("david");
      expect(res.body.data[1].username).toBe("charlie");
      expect(res.body.data[2].username).toBe("alice");
    });

    it("should filter by hasRecordings AND sort by username:asc", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        sort: "username:asc",
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(3);

      const usernames = res.body.data.map((f: any) => f.username);
      expect(usernames).toEqual(["alice", "charlie", "david"]);
    });
  });

  describe("totalRecordings count accuracy", () => {
    it("should return correct totalRecordings for each follower", async () => {
      const query = buildQuery({ scope: "following", sort: "username:asc" });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      const alice = res.body.data.find((f: any) => f.username === "alice");
      const bob = res.body.data.find((f: any) => f.username === "bob");
      const charlie = res.body.data.find((f: any) => f.username === "charlie");
      const david = res.body.data.find((f: any) => f.username === "david");
      const eve = res.body.data.find((f: any) => f.username === "eve");

      expect(alice.totalRecordings).toBe(3);
      expect(bob.totalRecordings).toBe(0); // failed source doesn't count
      expect(charlie.totalRecordings).toBe(2);
      expect(david.totalRecordings).toBe(1);
      expect(eve.totalRecordings).toBe(0);
    });
  });

  describe("Pagination", () => {
    it("should paginate results correctly", async () => {
      const query = buildQuery({
        scope: "following",
        sort: "username:asc",
        pagination: { page: 1, pageSize: 2 },
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].username).toBe("alice");
      expect(res.body.data[1].username).toBe("bob");
      expect(res.body.meta.pagination.total).toBe(5);
      expect(res.body.meta.pagination.pageCount).toBe(3);
    });

    it("should return correct second page", async () => {
      const query = buildQuery({
        scope: "following",
        sort: "username:asc",
        pagination: { page: 2, pageSize: 2 },
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].username).toBe("charlie");
      expect(res.body.data[1].username).toBe("david");
    });

    it("should paginate with hasRecordings filter", async () => {
      const query = buildQuery({
        scope: "following",
        hasRecordings: "true",
        sort: "totalRecordings:desc",
        pagination: { page: 1, pageSize: 2 },
      });

      const res = await request(getServer())
        .get(`/api/followers/browse?${query}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].username).toBe("alice");
      expect(res.body.data[1].username).toBe("charlie");
      expect(res.body.meta.pagination.total).toBe(3);
      expect(res.body.meta.pagination.pageCount).toBe(2);
    });
  });
});
