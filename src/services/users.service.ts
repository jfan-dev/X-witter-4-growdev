import { prisma } from "../prisma/client.js";
import { mapUserProfile } from "../dtos/user.dto.js";
import { AppError } from "../errors/app-error.js";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  return mapUserProfile(user);
}