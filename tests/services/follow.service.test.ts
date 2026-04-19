import { followUser, unfollowUser } from "../../src/services/follow.service.js";
import { prisma } from "../../src/prisma/client.js";

describe("follow.service", () => {
  let userA: any;
  let userB: any;

  beforeEach(async () => {
    await prisma.like.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.xweet.deleteMany();
    await prisma.user.deleteMany();

    userA = await prisma.user.create({
      data: {
        name: "User A",
        email: `a-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img",
        birthdate: new Date(),
      },
    });

    userB = await prisma.user.create({
      data: {
        name: "User B",
        email: `b-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img",
        birthdate: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("followUser", () => {
    it("should follow a user successfully", async () => {
      const result = await followUser(userA.id, userB.id);

      expect(result.message).toBe("User followed successfully");

      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userA.id,
            followingId: userB.id,
          },
        },
      });

      expect(follow).not.toBeNull();
    });

    it("should throw error if trying to follow yourself", async () => {
      await expect(
        followUser(userA.id, userA.id)
      ).rejects.toThrow("You cannot follow yourself");
    });

    it("should throw error if target user does not exist", async () => {
      await expect(
        followUser(userA.id, "non-existent-id")
      ).rejects.toThrow("User to follow not found");
    });

    it("should throw error if already following", async () => {
      await followUser(userA.id, userB.id);

      await expect(
        followUser(userA.id, userB.id)
      ).rejects.toThrow("Already following this user");
    });
  });

  describe("unfollowUser", () => {
    beforeEach(async () => {
      await followUser(userA.id, userB.id);
    });

    it("should unfollow a user successfully", async () => {
      const result = await unfollowUser(userA.id, userB.id);

      expect(result.message).toBe("User unfollowed successfully");

      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userA.id,
            followingId: userB.id,
          },
        },
      });

      expect(follow).toBeNull();
    });

    it("should throw error if not following the user", async () => {
      await unfollowUser(userA.id, userB.id);

      await expect(
        unfollowUser(userA.id, userB.id)
      ).rejects.toThrow("You are not following this user");
    });
  });
});