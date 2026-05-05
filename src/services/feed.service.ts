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

  const followingIds = following.map((follow) => follow.followingId);

  const authorIds = [userId, ...followingIds];

  const xweets = await prisma.xweet.findMany({
    where: {
      authorId: {
        in: authorIds,
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
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  return xweets.map(({ likes, ...xweet }) => ({
    ...xweet,
    likedByMe: likes.length > 0,
  }));
}