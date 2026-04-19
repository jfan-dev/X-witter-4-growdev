import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";

const generateDefaultAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

export async function signup({ name, email, password, birthdate }) {
  const userExists = await prisma.user.findUnique({
    where: { email }
  });
  
  if (userExists) {
    throw new Error("User already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      birthdate: new Date(birthdate),
      profileImage: generateDefaultAvatar(name),
    },
  });

  const { password: _, ...userWithoutPassword } = createdUser;

  return userWithoutPassword;
}

export async function signin({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { token };
}

