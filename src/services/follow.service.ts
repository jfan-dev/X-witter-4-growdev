import { prisma } from "../prisma/client.js";
import { AppError } from "../errors/app-error.js";

export async function followUser(currentUserId: string, targetUserId: string) {

  if (currentUserId === targetUserId) {
    throw new AppError("You cannot follow yourself", 409);
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError("User to follow not found", 404);
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    throw new AppError("Already following this user", 409);
  }

  await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  return { message: "User followed successfully" };
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (!existingFollow) {
    throw new AppError("You are not following this user", 409);
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  return { message: "User unfollowed successfully" };
}