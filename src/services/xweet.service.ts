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