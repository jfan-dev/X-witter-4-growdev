import { prisma } from "../prisma/client.js";
import { mapUserProfile } from "../dtos/user.dto.js";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tweets: true,
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
    throw new Error("User not found");
  }

  return mapUserProfile(user);
}