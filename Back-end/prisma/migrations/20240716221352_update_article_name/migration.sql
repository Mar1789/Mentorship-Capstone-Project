/*
  Warnings:

  - You are about to drop the `Aritcles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Aritcles" DROP CONSTRAINT "Aritcles_userId_fkey";

-- DropTable
DROP TABLE "Aritcles";

-- CreateTable
CREATE TABLE "Articles" (
    "articleId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("articleId")
);

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
