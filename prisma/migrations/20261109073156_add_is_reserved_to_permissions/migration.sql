/*
  Warnings:

  - You are about to drop the column `isSystem` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "isSystem",
ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false;
