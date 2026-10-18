/*
  Warnings:

  - Made the column `changedByUserId` on table `enrollment_status_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registeredByUserId` on table `enrollments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "enrollment_status_logs" DROP CONSTRAINT "enrollment_status_logs_changedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_registeredByUserId_fkey";

-- AlterTable
ALTER TABLE "enrollment_status_logs" ALTER COLUMN "changedByUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "registeredByUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_status_logs" ADD CONSTRAINT "enrollment_status_logs_changedByUserId_fkey" FOREIGN KEY ("changedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
