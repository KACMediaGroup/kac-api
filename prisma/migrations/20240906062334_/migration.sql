/*
  Warnings:

  - Added the required column `method` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `verification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VerificationTypeEnum" AS ENUM ('SIGNUP', 'PROFILE_UPDATE', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "VerificationMethodEnum" AS ENUM ('PHONE', 'EMAIL');

-- AlterTable
ALTER TABLE "verification" ADD COLUMN     "method" "VerificationMethodEnum" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "VerificationTypeEnum" NOT NULL;

-- DropEnum
DROP TYPE "verification_type_enum";
