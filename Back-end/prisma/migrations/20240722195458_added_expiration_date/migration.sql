/*
  Warnings:

  - Added the required column `expiredAt` to the `Verify` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verify" ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
