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

describe("core happy-path smoke flow", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  it(
    "should complete the core user flow end to end",
    async () => {
      const alice = await createAndLoginUser({ name: "Alice" });
      const bob = await createAndLoginUser({ name: "Bob" });

      const aliceXweetResponse = await request(app)
        .post("/xweets")
        .set("Authorization", `Bearer ${alice.token}`)
        .send({
          content: "Hello from Alice",
        })
        .expect(201);

      const aliceXweet = aliceXweetResponse.body;

      const bobXweetResponse = await request(app)
        .post("/xweets")
        .set("Authorization", `Bearer ${bob.token}`)
        .send({
          content: "Hello from Bob",
        })
        .expect(201);

      const bobXweet = bobXweetResponse.body;

      const followResponse = await request(app)
        .post(`/users/${alice.user.id}/follow`)
        .set("Authorization", `Bearer ${bob.token}`)
        .expect(200);

      expect(followResponse.body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        })
      );

      const feedResponse = await request(app)
        .get("/feed")
        .set("Authorization", `Bearer ${bob.token}`)
        .expect(200);

      expect(Array.isArray(feedResponse.body)).toBe(true);

      const feedIds = feedResponse.body.map((xweet: any) => xweet.id);

      expect(feedIds).toEqual(
        expect.arrayContaining([aliceXweet.id, bobXweet.id])
      );

      expect(feedResponse.body[0].id).toBe(bobXweet.id);
      expect(feedResponse.body[1].id).toBe(aliceXweet.id);

      const likeResponse = await request(app)
        .post(`/xweets/${aliceXweet.id}/like`)
        .set("Authorization", `Bearer ${bob.token}`)
        .expect(200);

      expect(likeResponse.body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        })
      );

      const unlikeResponse = await request(app)
        .delete(`/xweets/${aliceXweet.id}/like`)
        .set("Authorization", `Bearer ${bob.token}`)
        .expect(200);

      expect(unlikeResponse.body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        })
      );

      const aliceProfileResponse = await request(app)
        .get(`/users/${alice.user.id}`)
        .set("Authorization", `Bearer ${bob.token}`)
        .expect(200);

      expect(aliceProfileResponse.body).toEqual(
        expect.objectContaining({
          id: alice.user.id,
          name: "Alice",
          xweets: expect.any(Array),
          followers: expect.any(Array),
          following: expect.any(Array),
        })
      );

      expect(
        aliceProfileResponse.body.xweets.some(
          (xweet: any) => xweet.id === aliceXweet.id
        )
      ).toBe(true);

      expect(
        aliceProfileResponse.body.followers.some(
          (follower: any) => follower.id === bob.user.id
        )
      ).toBe(true);
    },
    20000
  );

  it("should allow replying to another user's xweet", async () => {
    const alice = await createAndLoginUser({ name: "Alice" });
    const bob = await createAndLoginUser({ name: "Bob" });

    const aliceXweetResponse = await request(app)
      .post("/xweets")
      .set("Authorization", `Bearer ${alice.token}`)
      .send({
        content: "Original xweet",
      })
      .expect(201);

    const originalXweet = aliceXweetResponse.body;

    const replyResponse = await request(app)
      .post(`/xweets/${originalXweet.id}/reply`)
      .set("Authorization", `Bearer ${bob.token}`)
      .send({
        content: "Reply from Bob",
      })
      .expect(201);

    expect(replyResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        content: "Reply from Bob",
        authorId: bob.user.id,
        parentId: originalXweet.id,
      })
    );
  });
});