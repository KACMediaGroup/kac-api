/*
  Warnings:

  - You are about to drop the column `isUsed` on the `reset_password` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reset_password" DROP COLUMN "isUsed",
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;
