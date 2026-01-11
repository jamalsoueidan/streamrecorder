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

describe("Follow Case-Insensitive Duplicate Prevention", () => {
  let originalDocumentId: string;

  it("should follow a streamer with mixed case", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "CaseSensitiveUser", type: "tiktok" })
      .expect(200);

    expect(res.body.data).toHaveProperty("documentId");
    originalDocumentId = res.body.data.documentId;
  });

  it("should return same documentId when following with lowercase", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "casesensitiveuser", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });

  it("should return same documentId when following with uppercase", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "CASESENSITIVEUSER", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });

  it("should return same documentId when following with random case", async () => {
    const res = await request(getServer())
      .post("/api/followers/follow")
      .set("Authorization", `Bearer ${jwt}`)
      .send({ username: "cAsEsEnSiTiVeUsEr", type: "tiktok" })
      .expect(200);

    expect(res.body.data.documentId).toBe(originalDocumentId);
  });

  it("should only have one entry in following list despite different case attempts", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const matches = res.body.data.filter(
      (f: any) => f.username.toLowerCase() === "casesensitiveuser"
    );
    expect(matches).toHaveLength(1);
  });

  it("should store username in normalized (lowercase) format", async () => {
    const res = await request(getServer())
      .get("/api/followers/browse?scope=following")
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    const match = res.body.data.find(
      (f: any) => f.username.toLowerCase() === "casesensitiveuser"
    );
    expect(match.username).toBe("CaseSensitiveUser"); // should be lowercase
  });
});
