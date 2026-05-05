import { prisma } from "../prisma/client.js";
import { mapUserProfile } from "../dtos/user.dto.js";
import { AppError } from "../errors/app-error.js";

export async function getUserProfile(
  targetUserId: string,
  currentUserId: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    include: {
      xweets: true,
      followers: {
        include: {
          follower: true,
        },
      },
      following: {
        include: {
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  return {
    ...mapUserProfile(user),
    isFollowing: Boolean(existingFollow),
  };
}

export async function searchUsers(query: string) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    throw new AppError("Search must have at least 2 characters", 400);
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
    orderBy: {
      name: "asc",
    },
    take: 10,
  });

  return users;
}