import { likeXweet, unlikeXweet } from "../../src/services/like.service.js";
import { prisma } from "../../src/prisma/client.js";

describe("like.service", () => {
  let user: any;
  let xweet: any;

  beforeEach(async () => {

    await prisma.like.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.xweet.deleteMany();
    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        name: "User",
        email: `user-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img",
        birthdate: new Date(),
      },
    });

    xweet = await prisma.xweet.create({
      data: {
        content: "Test xweet",
        authorId: user.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("likeXweet", () => {
    it("should like a xweet successfully", async () => {
      const result = await likeXweet(user.id, xweet.id);

      expect(result.message).toBe("Xweet liked");

      const like = await prisma.like.findUnique({
        where: {
          userId_xweetId: {
            userId: user.id,
            xweetId: xweet.id,
          },
        },
      });

      expect(like).not.toBeNull();
    });

    it("should throw error if xweet does not exist", async () => {
      await expect(
        likeXweet(user.id, "non-existent-id")
      ).rejects.toThrow("Xweet not found");
    });

    it("should throw error if already liked", async () => {
      await likeXweet(user.id, xweet.id);

      await expect(
        likeXweet(user.id, xweet.id)
      ).rejects.toThrow("You already liked this xweet");
    });
  });

  describe("unlikeXweet", () => {
    beforeEach(async () => {
      await likeXweet(user.id, xweet.id);
    });

    it("should unlike a xweet successfully", async () => {
      const result = await unlikeXweet(user.id, xweet.id);

      expect(result.message).toBe("Like removed");

      const like = await prisma.like.findUnique({
        where: {
          userId_xweetId: {
            userId: user.id,
            xweetId: xweet.id,
          },
        },
      });

      expect(like).toBeNull();
    });

    it("should throw error if xweet was not liked", async () => {
      await unlikeXweet(user.id, xweet.id);

      await expect(
        unlikeXweet(user.id, xweet.id)
      ).rejects.toThrow("You have not liked this xweet");
    });
  });
});