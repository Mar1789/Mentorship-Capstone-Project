/*
  Warnings:

  - Added the required column `followerId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "followerId" INTEGER NOT NULL;
