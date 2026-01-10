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

describe("Follow Whitespace Handling", () => {
  let originalDocumentId: string;

  it("should follow a streamer and trim whitespace", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "whitespaceuser", type: "tiktok" })
      .expect(200);

    expect(res.body.data).toHaveProperty("documentId");
    originalDocumentId = res.body.data.documentId;
  });

  it("should return same documentId when username has leading spaces", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "  whitespaceuser", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });

  it("should return same documentId when username has trailing spaces", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "whitespaceuser  ", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });

  it("should return same documentId with both whitespace and different case", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "  WhiteSpaceUser  ", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });
});
