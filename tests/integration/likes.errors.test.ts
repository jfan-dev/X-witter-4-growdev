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

async function createXweet(token: string, content = "Hello xweet") {
  const response = await request(app)
    .post("/xweets")
    .set("Authorization", `Bearer ${token}`)
    .send({ content })
    .expect(201);

  return response.body;
}

describe("likes integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("POST /xweets/:id/like", () => {
    it("should return 401 when token is missing", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const xweet = await createXweet(author.token, "Likeable xweet");

      const response = await request(app).post(`/xweets/${xweet.id}/like`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const xweet = await createXweet(author.token, "Likeable xweet");

      const response = await request(app)
        .post(`/xweets/${xweet.id}/like`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 404 when xweet does not exist", async () => {
      const user = await createAndLoginUser({ name: "Liker User" });

      const response = await request(app)
        .post(`/xweets/${randomUUID()}/like`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when the xweet is already liked", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const liker = await createAndLoginUser({ name: "Liker User" });
      const xweet = await createXweet(author.token, "Like me once");

      await request(app)
        .post(`/xweets/${xweet.id}/like`)
        .set("Authorization", `Bearer ${liker.token}`)
        .expect(200);

      const secondLikeResponse = await request(app)
        .post(`/xweets/${xweet.id}/like`)
        .set("Authorization", `Bearer ${liker.token}`);

      expect(secondLikeResponse.status).toBe(409);
      expect(secondLikeResponse.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("DELETE /xweets/:id/like", () => {
    it("should return 401 when token is missing", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const xweet = await createXweet(author.token, "Unlikeable xweet");

      const response = await request(app).delete(`/xweets/${xweet.id}/like`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const xweet = await createXweet(author.token, "Unlikeable xweet");

      const response = await request(app)
        .delete(`/xweets/${xweet.id}/like`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when trying to remove a like that does not exist", async () => {
      const author = await createAndLoginUser({ name: "Author User" });
      const liker = await createAndLoginUser({ name: "Liker User" });
      const xweet = await createXweet(author.token, "No like yet");

      const response = await request(app)
        .delete(`/xweets/${xweet.id}/like`)
        .set("Authorization", `Bearer ${liker.token}`);

      expect(response.status).toBe(409);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});