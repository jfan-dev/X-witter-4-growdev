import jwt from "jsonwebtoken";
import { env } from "../../src/config/env.js";
import { prisma } from "../../src/prisma/client.js";
import { signup, signin } from "../../src/services/auth.service.js";

describe("auth.service", () => {
    
  beforeEach(async () => {
    await prisma.like.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.xweet.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("signup", () => {
    it("should create a user successfully", async () => {
      const user = await signup({
        name: "John",
        email: "john@test.com",
        password: "123456",
        birthdate: "1990-01-01",
      });

      expect(user).toHaveProperty("id");
      expect(user.email).toBe("john@test.com");
      expect(user).not.toHaveProperty("password");
    });

    it("should hash the password", async () => {
      await signup({
        name: "John",
        email: "hash@test.com",
        password: "123456",
        birthdate: "1990-01-01",
      });

      const dbUser = await prisma.user.findUnique({
        where: { email: "hash@test.com" },
      });

      expect(dbUser).not.toBeNull();
      expect(dbUser!.password).not.toBe("123456");
    });

    it("should throw error if user already exists", async () => {
      await signup({
        name: "John",
        email: "duplicate@test.com",
        password: "123456",
        birthdate: "1990-01-01",
      });

      await expect(
        signup({
          name: "John",
          email: "duplicate@test.com",
          password: "123456",
          birthdate: "1990-01-01",
        })
      ).rejects.toThrow("User already exists");
    });
  });

  describe("signin", () => {
    beforeEach(async () => {
      await signup({
        name: "Jane",
        email: "jane@test.com",
        password: "123456",
        birthdate: "1995-01-01",
      });
    });

    it("should return a token for valid credentials", async () => {
      const result = await signin({
        email: "jane@test.com",
        password: "123456",
      });

      expect(result).toHaveProperty("token");
    });

    it("should generate a valid JWT token", async () => {
      const result = await signin({
        email: "jane@test.com",
        password: "123456",
      });

      const decoded = jwt.verify(result.token, env.jwtSecret) as any;

      expect(decoded).toHaveProperty("userId");
    });

    it("should throw error if user does not exist", async () => {
      await expect(
        signin({
          email: "notfound@test.com",
          password: "123456",
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password is incorrect", async () => {
      await expect(
        signin({
          email: "jane@test.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });
});