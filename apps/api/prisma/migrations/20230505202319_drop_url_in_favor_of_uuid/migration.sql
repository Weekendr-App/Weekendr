/*
  Warnings:

  - The primary key for the `VerificationRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `url` on the `VerificationRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "VerificationRequest_url_key";

-- AlterTable
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_pkey",
DROP COLUMN "url",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VerificationRequest_id_seq";
