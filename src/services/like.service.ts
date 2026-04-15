import { prisma } from "../prisma/client.js";

export async function likeXweet(userId: string, xweetId: string) {

  const xweet = await prisma.xweet.findUnique({
    where: { id: xweetId },
  });

  if (!xweet) {
    throw new Error("Xweet not found");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_xweetId: {
        userId,
        xweetId,
      },
    },
  });

  if (existingLike) {
    throw new Error("You already liked this xweet");
  }

  await prisma.like.create({
    data: {
      userId,
      xweetId,
    },
  });

  return { message: "Xweet liked" };
}

export async function unlikeXweet(userId: string, xweetId: string) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_xweetId: {
        userId,
        xweetId,
      },
    },
  });

  if (!existingLike) {
    throw new Error("You have not liked this xweet");
  }

  await prisma.like.delete({
    where: {
      userId_xweetId: {
        userId,
        xweetId,
      },
    },
  });

  return { message: "Like removed" };
}