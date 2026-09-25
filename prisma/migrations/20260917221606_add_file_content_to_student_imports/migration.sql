/*
  Warnings:

  - Added the required column `fileContent` to the `student_imports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "document_types" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "student_imports" ADD COLUMN     "fileContent" BYTEA NOT NULL;
