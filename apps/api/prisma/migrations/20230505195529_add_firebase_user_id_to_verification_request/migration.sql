/*
  Warnings:

  - You are about to drop the column `userId` on the `VerificationRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebaseUserId]` on the table `VerificationRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUserId` to the `VerificationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_userId_fkey";

-- DropIndex
DROP INDEX "VerificationRequest_userId_key";

-- AlterTable
ALTER TABLE "VerificationRequest" DROP COLUMN "userId",
ADD COLUMN     "firebaseUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_firebaseUserId_key" ON "VerificationRequest"("firebaseUserId");
