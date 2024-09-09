/*
  Warnings:

  - You are about to drop the column `verify_string` on the `verification` table. All the data in the column will be lost.
  - Added the required column `verification_code` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verification" DROP COLUMN "verify_string",
ADD COLUMN     "verification_code" TEXT NOT NULL;
