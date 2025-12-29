import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import {
  cleanupStrapi,
  createTestUser,
  getServer,
  grantPermissions,
  setupStrapi,
} from "../strapi";

jest.setTimeout(30000);

let jwt: string;

beforeAll(async () => {
  await setupStrapi();

  await grantPermissions(
    ["api::follower.follower.browse", "api::follower.follower.follow"],
    "premium"
  );

  const { jwt: userJwt } = await createTestUser(
    "user@test.com",
    "testuser",
    "premium"
  );
  jwt = userJwt;
});

afterAll(async () => {
  await cleanupStrapi();
});

describe("Follow Duplicate Prevention", () => {
  let firstDocumentId: string;

  it("should follow a streamer", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "duplicatetest", type: "tiktok" })
      .expect(200);

    expect(res.body.data).toHaveProperty("documentId");
    firstDocumentId = res.body.data.documentId;
  });

  it("should return same documentId when following same streamer again", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "duplicatetest", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(firstDocumentId);
  });

  it("should only have one streamer in following list", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const matches = res.body.data.filter(
      (f: any) => f.username === "duplicatetest"
    );
    expect(matches).toHaveLength(1);
  });

  it("should allow following different streamer with same username but different type", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "duplicatetest", type: "twitch" })
      .expect(200);

    expect(res.body.data.documentId).not.toBe(firstDocumentId);
  });

  it("should have two streamers in following list (same username, different type)", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const matches = res.body.data.filter(
      (f: any) => f.username === "duplicatetest"
    );
    expect(matches).toHaveLength(2);
    expect(matches.map((f: any) => f.type).sort()).toEqual([
      "tiktok",
      "twitch",
    ]);
  });
});
