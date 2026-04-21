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

describe("auth integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("POST /auth/signup", () => {
    it("should return 400 when request body is invalid", async () => {
      const response = await request(app).post("/auth/signup").send({
        name: "John Test",
        email: "invalid-email",
        password: "weak",
        birthdate: "2000-01-01",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 409 when email is already registered", async () => {
      const user = makeValidSignupBody();

      await request(app).post("/auth/signup").send(user).expect(201);

      const secondSignupResponse = await request(app)
        .post("/auth/signup")
        .send(user);

      expect(secondSignupResponse.status).toBe(409);
      expect(secondSignupResponse.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("POST /auth/signin", () => {
    it("should return 400 when request body is invalid", async () => {
      const response = await request(app).post("/auth/signin").send({
        email: "invalid-email",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when email does not exist", async () => {
      const response = await request(app).post("/auth/signin").send({
        email: `missing.${randomUUID()}@mail.com`,
        password: "Test@1234",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when password is incorrect", async () => {
      const user = await createUser();

      const response = await request(app).post("/auth/signin").send({
        email: user.credentials.email,
        password: "Wrong@1234",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});