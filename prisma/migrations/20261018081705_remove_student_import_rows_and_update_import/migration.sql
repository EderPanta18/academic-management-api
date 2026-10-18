/*
  Warnings:

  - You are about to drop the `student_import_rows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdByUserId,fileHash]` on the table `student_imports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileExtension` to the `student_imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileHash` to the `student_imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_imports` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdByUserId` on table `student_imports` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "student_import_rows" DROP CONSTRAINT "student_import_rows_createdStudentId_fkey";

-- DropForeignKey
ALTER TABLE "student_import_rows" DROP CONSTRAINT "student_import_rows_studentImportId_fkey";

-- DropForeignKey
ALTER TABLE "student_import_rows" DROP CONSTRAINT "student_import_rows_updatedStudentId_fkey";

-- DropForeignKey
ALTER TABLE "student_imports" DROP CONSTRAINT "student_imports_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "student_imports" ADD COLUMN     "errors" JSONB,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "fileExtension" VARCHAR(10) NOT NULL,
ADD COLUMN     "fileHash" VARCHAR(64) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdByUserId" SET NOT NULL;

-- DropTable
DROP TABLE "student_import_rows";

-- DropEnum
DROP TYPE "StudentImportRowStatus";

-- CreateIndex
CREATE UNIQUE INDEX "student_imports_createdByUserId_fileHash_key" ON "student_imports"("createdByUserId", "fileHash");

-- AddForeignKey
ALTER TABLE "student_imports" ADD CONSTRAINT "student_imports_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
