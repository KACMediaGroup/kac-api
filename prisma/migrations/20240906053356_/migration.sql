/*
  Warnings:

  - You are about to drop the column `phone_number` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `verify_number` on the `verification` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verify_string` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `verification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "verification_type_enum" AS ENUM ('SIGNUP', 'PROFILE_UPDATE', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "verification" DROP COLUMN "phone_number",
DROP COLUMN "verify_number",
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD COLUMN     "verify_string" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "verification_type_enum" NOT NULL;

-- DropEnum
DROP TYPE "VerificationTypeEnum";
