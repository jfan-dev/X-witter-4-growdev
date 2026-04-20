import { prisma } from "../prisma/client.js";
import { AppError } from "../errors/app-error.js";

export async function likeXweet(userId: string, xweetId: string) {

  const xweet = await prisma.xweet.findUnique({
    where: { id: xweetId },
  });

  if (!xweet) {
    throw new AppError("Xweet not found", 404);
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
    throw new AppError("You already liked this xweet", 409);
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
    throw new AppError("You have not liked this xweet", 409);
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