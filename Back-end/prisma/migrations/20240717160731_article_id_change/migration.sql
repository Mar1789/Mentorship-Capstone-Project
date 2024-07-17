/*
  Warnings:

  - The primary key for the `Articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Articles` table. All the data in the column will be lost.
  - The required column `articleId` was added to the `Articles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_pkey",
DROP COLUMN "id",
ADD COLUMN     "articleId" TEXT NOT NULL,
ADD CONSTRAINT "Articles_pkey" PRIMARY KEY ("articleId");
