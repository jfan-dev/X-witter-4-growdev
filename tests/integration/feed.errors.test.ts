import request from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/prisma/client.js";

async function clearDatabase() {
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.xweet.deleteMany();
  await prisma.user.deleteMany();
}

describe("feed integration error paths", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("GET /feed", () => {
    it("should return 401 when token is missing", async () => {
      const response = await request(app).get("/feed");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .get("/feed")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});