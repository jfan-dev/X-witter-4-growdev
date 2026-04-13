import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const users = [];

const generateDefaultAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

export async function signup({ name, email, password, birthdate }) {
  const userExists = users.find(u => u.email === email);
  const hashedPassword = await bcrypt.hash(password, 10);

  if (userExists) {
    throw new Error("User already exists");
  }

  const newUser = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
    birthdate,
    profileImage: generateDefaultAvatar(name),
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
}

export async function signin({ email, password }) {
  const user = users.find(u => u.email === email);
  const isValid = await bcrypt.compare(password, user.password);

  if (!user || !isValid) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

