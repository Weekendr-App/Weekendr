/*
  Warnings:

  - Added the required column `address` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
