import { prisma } from "../prisma/client.js";

export async function createXweet(
  userId: string, 
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new Error("Xweet content cannot be empty");
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
    throw new Error("Reply content cannot be empty");
  }

  const parent = await prisma.xweet.findUnique({
    where: { id: parentId },
  });

  if (!parent) {
    throw new Error("Xweet to reply not found");
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