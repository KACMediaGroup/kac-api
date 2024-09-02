-- CreateEnum
CREATE TYPE "user_status_enum" AS ENUM ('ACTIVE', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "provider_type_enum" AS ENUM ('KAKAO', 'NAVER', 'GOOGLE', 'FACEBOOK', 'APPLE');

-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('USER', 'TEACHER', 'ACADEMY_TEACHER', 'ACADEMY_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "verify_phone_number_type_enum" AS ENUM ('SIGNUP', 'PROFILE_UPDATE');

-- CreateEnum
CREATE TYPE "file_type_enum" AS ENUM ('TEACHER_PROFILE_IMAGE', 'ACADEMY_MAIN_BANNER_IMAGE_PC', 'ACADEMY_MAIN_BANNER_IMAGE_MOBILE', 'ACADEMY_INFO_IMAGE', 'ACADEMY_TEACHER_IMAGE', 'ETC');

-- CreateEnum
CREATE TYPE "teacher_status_enum" AS ENUM ('APPLY', 'REVIEW', 'ACTIVE', 'REJECT', 'PAUSE');

-- CreateEnum
CREATE TYPE "academy_status_enum" AS ENUM ('APPLY', 'REVIEW', 'ACTIVE', 'REJECT', 'PAUSE');

-- CreateEnum
CREATE TYPE "academy_teacher_status_enum" AS ENUM ('APPLY', 'REVIEW', 'ACTIVE', 'REJECT', 'PAUSE');

-- CreateEnum
CREATE TYPE "section_type_enum" AS ENUM ('ACADEMY_MAIN_TEACHER_INFO_TITLE', 'ACADEMY_MAIN_TEACHER_INFO_CONTENT', 'ACADEMY_MAIN_FEATURES_TITLE', 'ACADEMY_MAIN_CLASS_WATCH_TITLE', 'ACADEMY_MAIN_CLASS_WATCH_CONTENT');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "birthday" TIMESTAMP(3),
    "address" TEXT,
    "address_detail" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_agree" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_age_agree" BOOLEAN NOT NULL DEFAULT true,
    "is_service_agree" BOOLEAN NOT NULL DEFAULT true,
    "is_private_agree" BOOLEAN NOT NULL DEFAULT true,
    "is_marketing_agree" BOOLEAN,
    "marketing_agree_updated_at" TIMESTAMP(3),

    CONSTRAINT "user_agree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" SERIAL NOT NULL,
    "provider_type" "provider_type_enum" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "role_enum" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verify_phone_number" (
    "id" SERIAL NOT NULL,
    "type" "verify_phone_number_type_enum" NOT NULL,
    "phone_number" TEXT NOT NULL,
    "verify_number" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verify_phone_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reset_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_withdrawal_reason" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_withdrawal_reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_code" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "common_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "file_id" TEXT NOT NULL,
    "target_id" INTEGER,
    "type" "file_type_enum" NOT NULL,
    "display_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "teacher_status_enum" NOT NULL,
    "artist_name" TEXT NOT NULL,
    "class_category" TEXT NOT NULL,
    "introduce" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy" (
    "id" SERIAL NOT NULL,
    "status" "academy_status_enum" NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "address_detail" TEXT,
    "tel" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "academy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_admin" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "academy_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "academy_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_teacher" (
    "id" SERIAL NOT NULL,
    "status" "academy_teacher_status_enum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "teacher_id" INTEGER NOT NULL,
    "academy_id" INTEGER NOT NULL,

    CONSTRAINT "academy_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_teacher_info" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "academy_teacher_id" INTEGER,
    "academy_id" INTEGER NOT NULL,

    CONSTRAINT "academy_teacher_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_info" (
    "id" SERIAL NOT NULL,
    "academy_id" INTEGER NOT NULL,
    "short_introduce" TEXT,
    "introduce" TEXT,
    "features" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "academy_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_advantage" (
    "id" SERIAL NOT NULL,
    "academy_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "academy_advantage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" SERIAL NOT NULL,
    "target_id" INTEGER NOT NULL,
    "type" "section_type_enum" NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_agree_user_id_key" ON "user_agree"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_withdrawal_reason_user_id_key" ON "user_withdrawal_reason"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "file_file_id_key" ON "file"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_user_id_key" ON "teacher"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_admin_academy_id_key" ON "academy_admin"("academy_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_admin_user_id_key" ON "academy_admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_teacher_info_academy_teacher_id_key" ON "academy_teacher_info"("academy_teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "academy_info_academy_id_key" ON "academy_info"("academy_id");

-- AddForeignKey
ALTER TABLE "user_agree" ADD CONSTRAINT "user_agree_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_withdrawal_reason" ADD CONSTRAINT "user_withdrawal_reason_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common_code" ADD CONSTRAINT "common_code_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "common_code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_admin" ADD CONSTRAINT "academy_admin_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_admin" ADD CONSTRAINT "academy_admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_teacher" ADD CONSTRAINT "academy_teacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_teacher" ADD CONSTRAINT "academy_teacher_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_teacher_info" ADD CONSTRAINT "academy_teacher_info_academy_teacher_id_fkey" FOREIGN KEY ("academy_teacher_id") REFERENCES "academy_teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_teacher_info" ADD CONSTRAINT "academy_teacher_info_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_info" ADD CONSTRAINT "academy_info_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_advantage" ADD CONSTRAINT "academy_advantage_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
