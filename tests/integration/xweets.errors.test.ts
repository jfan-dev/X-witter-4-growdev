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

function makeValidSignupBody(overrides = {}) {
  return {
    name: "John Test",
    email: `john.${randomUUID()}@mail.com`,
    password: "Test@1234",
    birthdate: "2000-01-01",
    ...overrides,
  };
}

async function createAndLoginUser(overrides = {}) {
  const user = makeValidSignupBody(overrides);

  await request(app).post("/auth/signup").send(user).expect(201);

  const signinResponse = await request(app)
    .post("/auth/signin")
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200);

  return {
    token: signinResponse.body.token,
    user,
  };
}

describe("xweets integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("POST /xweets", () => {
    it("should return 401 when token is missing", async () => {
      const response = await request(app).post("/xweets").send({
        content: "Hello world",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .post("/xweets")
        .set("Authorization", "Bearer invalid-token")
        .send({
          content: "Hello world",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return a client error when content is empty", async () => {
      const { token } = await createAndLoginUser();

      const response = await request(app)
        .post("/xweets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "",
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
});

  describe("POST /xweets/:id/reply", () => {
    it("should return a client error when :id is invalid", async () => {
        const { token } = await createAndLoginUser();
        
        const response = await request(app)
        .post("/xweets/not-a-uuid/reply")
        .set("Authorization", `Bearer ${token}`)
        .send({
            content: "reply content",
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it("should return 404 when parent xweet does not exist", async () => {
      const { token } = await createAndLoginUser();

      const response = await request(app)
        .post(`/xweets/${randomUUID()}/reply`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a reply",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return a client error when reply content is empty", async () => {
      const { token } = await createAndLoginUser();

      const createdXweet = await request(app)
        .post("/xweets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "Parent xweet",
        })
        .expect(201);

      const response = await request(app)
        .post(`/xweets/${createdXweet.body.id}/reply`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "",
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
  });

});