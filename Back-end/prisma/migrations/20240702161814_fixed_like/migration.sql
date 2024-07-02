/*
  Warnings:

  - You are about to drop the column `Text` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Like" DROP COLUMN "Text",
DROP COLUMN "createdAt";
