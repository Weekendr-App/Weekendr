/*
  Warnings:

  - Added the required column `address` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "location" geography(Point, 4326) NOT NULL;
