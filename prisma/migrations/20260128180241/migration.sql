/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AppState" AS ENUM ('QUEUED', 'SCANNED', 'FAILED');

-- CreateEnum
CREATE TYPE "VirusCheckStatus" AS ENUM ('SAFE', 'VIRUS');

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "icon" BYTEA,
    "filename" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500),
    "file_data" BYTEA,
    "file_size" BIGINT NOT NULL,
    "mime_type" VARCHAR(100),
    "name" VARCHAR(255),
    "comment" TEXT,
    "virus_check_status" "AppState" NOT NULL DEFAULT 'QUEUED',
    "scan_result" "VirusCheckStatus",
    "permalink" VARCHAR(500),
    "scan_error" TEXT,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_checked" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virus_total_checks" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "status" "VirusCheckStatus" NOT NULL,
    "response_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "positives" INTEGER,
    "total" INTEGER,
    "scan_date" TIMESTAMP(3),
    "permalink" VARCHAR(500) NOT NULL,
    "scans" JSONB,

    CONSTRAINT "virus_total_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_hash_key" ON "applications"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "applications_filename_key" ON "applications"("filename");

-- CreateIndex
CREATE INDEX "applications_hash_idx" ON "applications"("hash");

-- CreateIndex
CREATE INDEX "applications_virus_check_status_idx" ON "applications"("virus_check_status");

-- CreateIndex
CREATE INDEX "applications_upload_date_idx" ON "applications"("upload_date");

-- CreateIndex
CREATE UNIQUE INDEX "virus_total_checks_permalink_key" ON "virus_total_checks"("permalink");

-- CreateIndex
CREATE INDEX "virus_total_checks_application_id_idx" ON "virus_total_checks"("application_id");

-- CreateIndex
CREATE INDEX "virus_total_checks_response_date_idx" ON "virus_total_checks"("response_date");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virus_total_checks" ADD CONSTRAINT "virus_total_checks_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
