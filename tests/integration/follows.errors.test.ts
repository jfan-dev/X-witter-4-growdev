import request from "supertest";
import { randomUUID } from "node:crypto";

import app from "../../src/app.js";
import { prisma } from "../../src/prisma/client.js";

type TestUserInput = {
  name: string;
  email: string;
  password: string;
  birthdate: string;
};

async function clearDatabase() {
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.xweet.deleteMany();
  await prisma.user.deleteMany();
}

function makeValidSignupBody(overrides: Partial<TestUserInput> = {}) {
  return {
    name: "John Test",
    email: `john.${randomUUID()}@mail.com`,
    password: "Test@1234",
    birthdate: "2000-01-01",
    ...overrides,
  };
}

async function createUser(overrides: Partial<TestUserInput> = {}) {
  const credentials = makeValidSignupBody(overrides);

  const signupResponse = await request(app)
    .post("/auth/signup")
    .send(credentials)
    .expect(201);

  return {
    createdUser: signupResponse.body,
    credentials,
  };
}

async function createAndLoginUser(overrides: Partial<TestUserInput> = {}) {
  const { createdUser, credentials } = await createUser(overrides);

  const signinResponse = await request(app)
    .post("/auth/signin")
    .send({
      email: credentials.email,
      password: credentials.password,
    })
    .expect(200);

  return {
    token: signinResponse.body.token,
    user: createdUser,
    credentials,
  };
}

describe("follows integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("POST /users/:id/follow", () => {
    it("should return 401 when token is missing", async () => {
      const target = await createUser({ name: "Target User" });

      const response = await request(app).post(
        `/users/${target.createdUser.id}/follow`
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const target = await createUser({ name: "Target User" });

      const response = await request(app)
        .post(`/users/${target.createdUser.id}/follow`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when trying to follow yourself", async () => {
      const { token, user } = await createAndLoginUser();

      const response = await request(app)
        .post(`/users/${user.id}/follow`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(409);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 404 when target user does not exist", async () => {
      const { token } = await createAndLoginUser();

      const response = await request(app)
        .post(`/users/${randomUUID()}/follow`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when already following the target user", async () => {
      const follower = await createAndLoginUser({ name: "Follower User" });
      const target = await createUser({ name: "Target User" });

      await request(app)
        .post(`/users/${target.createdUser.id}/follow`)
        .set("Authorization", `Bearer ${follower.token}`)
        .expect(200);

      const secondFollowResponse = await request(app)
        .post(`/users/${target.createdUser.id}/follow`)
        .set("Authorization", `Bearer ${follower.token}`);

      expect(secondFollowResponse.status).toBe(409);
      expect(secondFollowResponse.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("DELETE /users/:id/follow", () => {
    it("should return 401 when token is missing", async () => {
      const target = await createUser({ name: "Target User" });

      const response = await request(app).delete(
        `/users/${target.createdUser.id}/follow`
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const target = await createUser({ name: "Target User" });

      const response = await request(app)
        .delete(`/users/${target.createdUser.id}/follow`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when trying to unfollow a user that is not being followed", async () => {
      const follower = await createAndLoginUser({ name: "Follower User" });
      const target = await createUser({ name: "Target User" });

      const response = await request(app)
        .delete(`/users/${target.createdUser.id}/follow`)
        .set("Authorization", `Bearer ${follower.token}`);

      expect(response.status).toBe(409);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});