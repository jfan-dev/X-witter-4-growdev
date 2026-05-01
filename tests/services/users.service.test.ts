import { prisma } from "../../src/prisma/client.js";
import { getUserProfile } from "../../src/services/users.service.js";

describe("users.service", () => {
  let userA: any;
  let userB: any;

  beforeEach(async () => {

    await prisma.session.deleteMany();
    await prisma.like.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.xweet.deleteMany();
    await prisma.user.deleteMany();


    userA = await prisma.user.create({
      data: {
        name: "User A",
        email: `a-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img-a",
        birthdate: new Date(),
      },
    });

    userB = await prisma.user.create({
      data: {
        name: "User B",
        email: `b-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img-b",
        birthdate: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return user profile", async () => {
    const profile = await getUserProfile(userA.id);

    expect(profile.id).toBe(userA.id);
    expect(profile.name).toBe("User A");
    expect(profile.email).toBeDefined();
  });

  it("should throw error if user does not exist", async () => {
    await expect(
      getUserProfile("non-existent-id")
    ).rejects.toThrow("User not found");
  });

  it("should include user's xweets", async () => {
    await prisma.xweet.create({
      data: {
        content: "Hello",
        authorId: userA.id,
      },
    });

    const profile = await getUserProfile(userA.id);

    expect(profile.xweets.length).toBe(1);
    expect(profile.xweets[0].content).toBe("Hello");
  });

  it("should include followers", async () => {

    await prisma.follow.create({
      data: {
        followerId: userB.id,
        followingId: userA.id,
      },
    });

    const profile = await getUserProfile(userA.id);

    expect(profile.followers.length).toBe(1);
    expect(profile.followers[0].id).toBe(userB.id);
  });

  it("should include following users", async () => {

    await prisma.follow.create({
      data: {
        followerId: userA.id,
        followingId: userB.id,
      },
    });

    const profile = await getUserProfile(userA.id);

    expect(profile.following.length).toBe(1);
    expect(profile.following[0].id).toBe(userB.id);
  });

  it("should return empty arrays when no relations exist", async () => {
    const profile = await getUserProfile(userA.id);

    expect(profile.xweets).toEqual([]);
    expect(profile.followers).toEqual([]);
    expect(profile.following).toEqual([]);
  });
});