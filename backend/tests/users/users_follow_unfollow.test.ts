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
    [
      "api::follower.follower.browse",
      "api::follower.follower.follow",
      "api::follower.follower.unfollow",
    ],
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

describe("Follow / Unfollow", () => {
  let username = "coolstreamer";
  let type = "tiktok";

  it("should follow a streamer", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username, type })
      .expect(200);

    expect(res.body.data).toHaveProperty("documentId");
  });

  it("should see streamer in following list", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].username).toBe("coolstreamer");
    expect(res.body.data[0].isFollowing).toBe(true);
  });

  it("should NOT see streamer in discover list while following", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=discover")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const found = res.body.data.find((f: any) => f.username === "coolstreamer");
    expect(found).toBeUndefined();
  });

  it("should unfollow the streamer", async () => {
    await request(getServer())
      .post(`/api/followers/unfollow`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username, type })
      .expect(200);
  });

  it("should NOT see streamer in following list after unfollow", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    expect(res.body.data).toHaveLength(0);
  });

  it("should see streamer in discover list after unfollow", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=discover")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const found = res.body.data.find((f: any) => f.username === "coolstreamer");
    expect(found).toBeDefined();
    expect(found.isFollowing).toBe(false);
  });
});
