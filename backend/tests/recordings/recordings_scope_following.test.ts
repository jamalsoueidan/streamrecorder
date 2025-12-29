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

  await grantPermissions(
    [
      "api::follower.follower.find",
      "api::follower.follower.browse",
      "api::follower.follower.follow",
      "api::recording.recording.find",
      "api::recording.recording.browse",
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

  const { jwt: userJwt2 } = await createTestUser(
    "user2@test.com",
    "testuser2",
    "premium"
  );
  jwt2 = userJwt2;

  // User 1 follows alice and bob
  const alice = await followStreamer(jwt, "alice", "tiktok");
  const bob = await followStreamer(jwt, "bob", "tiktok");
  followers.push(alice, bob);

  // User 2 follows charlie (User 1 should NOT see charlie's recordings)
  const charlie = await followStreamer(jwt2, "charlie", "tiktok");
  followers.push(charlie);

  // alice - has recording with valid source
  await createRecording(alice.id, { withSource: true, sourceState: "done" });

  // bob - has recording with failed source
  await createRecording(bob.id, { withSource: true, sourceState: "failed" });

  // charlie - has recording (but User 1 doesn't follow charlie)
  await createRecording(charlie.id, { withSource: true, sourceState: "done" });
});

afterAll(async () => {
  await cleanupStrapi();
});

describe("Recordings Browse (scope=following)", () => {
  it("should return only recordings from followed streamers", async () => {
    const query = buildQuery({
      scope: "following",
    });

    const res = await request(getServer())
      .get(`/api/recordings/browse?${query}`)
      .set("Authorization", `Bearer ${jwt}`);

    expect(res.body.data).toHaveLength(2);
  });

  it("should NOT return recordings from streamers user doesnt follow", async () => {
    const query = buildQuery({
      scope: "following",
      populate: {
        follower: {
          fields: ["username", "type"],
        },
      },
    });

    const res = await request(getServer())
      .get(`/api/recordings/browse?${query}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const usernames = res.body.data.map((r: any) => r.follower.username);
    expect(usernames).toContain("alice");
    expect(usernames).toContain("bob");
    expect(usernames).not.toContain("charlie");
  });

  it("should populate sources", async () => {
    const query = buildQuery({
      scope: "following",
      populate: {
        follower: true,
        sources: { fields: ["*"] },
      },
    });

    const res = await request(getServer())
      .get(`/api/recordings/browse?${query}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const alice = res.body.data.find(
      (r: any) => r.follower.username === "alice"
    );
    expect(alice.sources).toHaveLength(1);
    expect(alice.sources[0].state).toBe("done");
  });

  it("should filter out failed sources", async () => {
    const query = buildQuery({
      scope: "following",
      populate: {
        follower: true,
        sources: {
          fields: ["*"],
          filters: { state: { $ne: "failed" } },
        },
      },
    });

    const res = await request(getServer())
      .get(`/api/recordings/browse?${query}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const alice = res.body.data.find(
      (r: any) => r.follower.username === "alice"
    );
    expect(alice.sources).toHaveLength(1);
    expect(alice.sources[0].state).toBe("done");

    const bob = res.body.data.find((r: any) => r.follower.username === "bob");
    expect(bob.sources).toHaveLength(0);
  });

  it("should sort by createdAt:desc", async () => {
    const query = buildQuery({ scope: "following", sort: "createdAt:desc" });

    const res = await request(getServer())
      .get(`/api/recordings/browse?${query}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const dates = res.body.data.map((r: any) =>
      new Date(r.createdAt).getTime()
    );
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });
});
