/*
  Warnings:

  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_parentId_fkey";

-- DropTable
DROP TABLE "Tweet";

-- CreateTable
CREATE TABLE "Xweet" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Xweet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Xweet" ADD CONSTRAINT "Xweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Xweet" ADD CONSTRAINT "Xweet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Xweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
