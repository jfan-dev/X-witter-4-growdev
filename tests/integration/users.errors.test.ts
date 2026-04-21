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

describe("users integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("GET /users/:id", () => {
    it("should return 401 when token is missing", async () => {
      const target = await createUser({ name: "Target User" });

      const response = await request(app).get(`/users/${target.createdUser.id}`);

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
        .get(`/users/${target.createdUser.id}`)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 404 when user does not exist", async () => {
      const requester = await createAndLoginUser({ name: "Requester User" });

      const response = await request(app)
        .get(`/users/${randomUUID()}`)
        .set("Authorization", `Bearer ${requester.token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});