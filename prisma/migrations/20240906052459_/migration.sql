/*
  Warnings:

  - You are about to drop the `verify_phone_number` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationTypeEnum" AS ENUM ('SIGNUP', 'PROFILE_UPDATE', 'PASSWORD_RESET');

-- DropTable
DROP TABLE "verify_phone_number";

-- DropEnum
DROP TYPE "verify_phone_number_type_enum";

-- CreateTable
CREATE TABLE "verification" (
    "id" SERIAL NOT NULL,
    "type" "VerificationTypeEnum" NOT NULL,
    "phone_number" TEXT NOT NULL,
    "verify_number" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);
