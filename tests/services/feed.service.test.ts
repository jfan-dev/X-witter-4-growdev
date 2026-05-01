import { prisma } from "../../src/prisma/client.js";
import { getFeed } from "../../src/services/feed.service.js";

describe("feed.service", () => {
  let userA: any;
  let userB: any;
  let userC: any;

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

    userC = await prisma.user.create({
      data: {
        name: "User C",
        email: `c-${Date.now()}@test.com`,
        password: "hashed",
        profileImage: "img",
        birthdate: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return user's own xweets", async () => {
    await prisma.xweet.create({
      data: {
        content: "User A xweet",
        authorId: userA.id,
      },
    });

    const feed = await getFeed(userA.id);

    expect(feed.length).toBe(1);
    expect(feed[0].author.id).toBe(userA.id);
  });

  it("should include xweets from followed users", async () => {

    await prisma.follow.create({
      data: {
        followerId: userA.id,
        followingId: userB.id,
      },
    });

    await prisma.xweet.create({
      data: {
        content: "User B xweet",
        authorId: userB.id,
      },
    });

    const feed = await getFeed(userA.id);

    expect(feed.length).toBe(1);
    expect(feed[0].author.id).toBe(userB.id);
  });

  it("should include both own and followed users xweets", async () => {
    await prisma.follow.create({
      data: {
        followerId: userA.id,
        followingId: userB.id,
      },
    });

    await prisma.xweet.create({
      data: {
        content: "A xweet",
        authorId: userA.id,
      },
    });

    await prisma.xweet.create({
      data: {
        content: "B xweet",
        authorId: userB.id,
      },
    });

    const feed = await getFeed(userA.id);

    expect(feed.length).toBe(2);

    const authors = feed.map(t => t.author.id);
    expect(authors).toContain(userA.id);
    expect(authors).toContain(userB.id);
  });

  it("should NOT include xweets from non-followed users", async () => {
    await prisma.xweet.create({
      data: {
        content: "User C xweet",
        authorId: userC.id,
      },
    });

    const feed = await getFeed(userA.id);

    expect(feed.length).toBe(0);
  });

  it("should return xweets sorted by newest first", async () => {
    await prisma.xweet.create({
      data: {
        content: "Old xweet",
        authorId: userA.id,
        createdAt: new Date("2020-01-01"),
      },
    });

    await prisma.xweet.create({
      data: {
        content: "New xweet",
        authorId: userA.id,
        createdAt: new Date("2023-01-01"),
      },
    });

    const feed = await getFeed(userA.id);

    expect(feed[0].content).toBe("New xweet");
    expect(feed[1].content).toBe("Old xweet");
  });

  it("should return empty feed if no xweets exist", async () => {
    const feed = await getFeed(userA.id);

    expect(feed.length).toBe(0);
  });
});