import { prisma } from "../prisma/client.js";
import { AppError } from "../errors/app-error.js";

export async function createXweet(
  userId: string, 
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new AppError("Xweet content cannot be empty", 400);
  }

  const xweet = await prisma.xweet.create({
    data: {
      content,
      authorId: userId,
    },
  });

  return xweet;
}

export async function replyToXweet(
  userId: string,
  parentId: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new AppError("Reply content cannot be empty", 400);
  }

  const parent = await prisma.xweet.findUnique({
    where: { id: parentId },
  });

  if (!parent) {
    throw new AppError("Xweet to reply not found", 404);
  }

  const reply = await prisma.xweet.create({
    data: {
      content,
      authorId: userId,
      parentId,
    },
  });

  return reply;
}

export async function getXweetThread(userId: string, xweetId: string) {
  const xweet = await prisma.xweet.findUnique({
    where: {
      id: xweetId,
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
      replies: {
        orderBy: {
          createdAt: "asc",
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
      },
    },
  });

  if (!xweet) {
    throw new AppError("Xweet not found", 404);
  }

  const { likes, replies, ...mainXweet } = xweet;

  return {
    ...mainXweet,
    likedByMe: likes.length > 0,
    repliesCount: replies.length,
    replies: replies.map(({ likes, ...reply }) => ({
      ...reply,
      likedByMe: likes.length > 0,
    })),
  };
}