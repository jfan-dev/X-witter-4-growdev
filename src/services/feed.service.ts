import { prisma } from "../prisma/client.js";

export async function getFeed(userId: string) {

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map(f => f.followingId);

  const authors = [userId, ...followingIds];

  const tweets = await prisma.tweet.findMany({
    where: {
      authorId: {
        in: authors,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  return tweets;
}