import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";
import { AppError } from "../errors/app-error.js";

const generateDefaultAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

type SignupInput = {
  name: string;
  email: string;
  password: string;
  birthdate: string;
};

type SigninInput = {
  email: string;
  password: string;
};


export async function signup({ name, email, password, birthdate }: SignupInput) {
  const userExists = await prisma.user.findUnique({
    where: { email }
  });
  
  if (userExists) {
    throw new AppError("User already exists", 409);
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

export async function signin({ email, password }: SigninInput) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      sessionId: session.id,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

  return { token };
}

