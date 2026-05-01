import { prisma } from "../../src/prisma/client.js";
import { createXweet } from "../../src/services/xweet.service.js";
import { replyToXweet } from "../../src/services/xweet.service.js";

describe("createXweet", () => {
  let userId: string;

  beforeEach(async () => {

    await prisma.$transaction([
      await prisma.session.deleteMany();
      await prisma.like.deleteMany();
      await prisma.follow.deleteMany();
      await prisma.xweet.deleteMany();
      await prisma.user.deleteMany();
    ]);

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "test.png",
        birthdate: new Date("1990-01-01"),
      },
    });

    userId = user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a xweet successfully", async () => {
    const result = await createXweet(userId, "Hello test");

    expect(result).toHaveProperty("id");
    expect(result.content).toBe("Hello test");
    expect(result.authorId).toBe(userId);
  });

  it("should throw error if content is empty", async () => {
    await expect(createXweet(userId, "")).rejects.toThrow(
      "Xweet content cannot be empty"
    );
  });

  it("should throw error if content is only spaces", async () => {
    await expect(createXweet(userId, "   ")).rejects.toThrow(
      "Xweet content cannot be empty"
    );
  });

  it("should persist xweet in database", async () => {
    const result = await createXweet(userId, "Persist test");

    const found = await prisma.xweet.findUnique({
      where: { id: result.id },
    });

    expect(found).not.toBeNull();
    expect(found?.content).toBe("Persist test");
  });

  it("should allow multiple xweets from same user", async () => {
    const first = await createXweet(userId, "First");
    const second = await createXweet(userId, "Second");

    expect(first.id).not.toBe(second.id);
  });
});

describe("replyToXweet", () => {
  let userId: string;
  let parentXweetId: string;

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.like.deleteMany(),
      prisma.follow.deleteMany(),
      prisma.xweet.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "test.png",
        birthdate: new Date("1990-01-01"),
      },
    });

    userId = user.id;

    const parent = await prisma.xweet.create({
      data: {
        content: "Parent xweet",
        authorId: userId,
      },
    });

    parentXweetId = parent.id;
  });

  it("should create a reply successfully", async () => {
    const reply = await replyToXweet(userId, parentXweetId, "Reply here");

    expect(reply).toHaveProperty("id");
    expect(reply.parentId).toBe(parentXweetId);
    expect(reply.content).toBe("Reply here");
  });

  it("should throw error if content is empty", async () => {
    await expect(
      replyToXweet(userId, parentXweetId, "")
    ).rejects.toThrow("Reply content cannot be empty");
  });

  it("should throw error if parent xweet does not exist", async () => {
    await expect(
      replyToXweet(userId, "non-existent-id", "Hello")
    ).rejects.toThrow("Xweet to reply not found");
  });

  it("should persist reply in database", async () => {
    const reply = await replyToXweet(userId, parentXweetId, "Persist reply");

    const found = await prisma.xweet.findUnique({
      where: { id: reply.id },
    });

    expect(found).not.toBeNull();
    expect(found?.parentId).toBe(parentXweetId);
  });
});