import { prisma } from "../prisma/client.js";

export async function followUser(currentUserId: string, targetUserId: string) {

  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error("User to follow not found");
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
    throw new Error("Already following this user");
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
    throw new Error("You are not following this user");
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