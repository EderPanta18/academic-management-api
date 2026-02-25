/*
  Warnings:

  - The primary key for the `professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `professor` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `professor` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `professor` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `professor` table. All the data in the column will be lost.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `student` table. All the data in the column will be lost.
  - Added the required column `person_id` to the `professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course_offering` DROP FOREIGN KEY `course_offering_professor_id_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `enrollment_student_id_fkey`;

-- DropIndex
DROP INDEX `course_offering_professor_id_fkey` ON `course_offering`;

-- DropIndex
DROP INDEX `professor_email_key` ON `professor`;

-- DropIndex
DROP INDEX `student_email_key` ON `student`;

-- AlterTable
ALTER TABLE `professor` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `first_name`,
    DROP COLUMN `id`,
    DROP COLUMN `last_name`,
    ADD COLUMN `hire_date` DATE NULL,
    ADD COLUMN `person_id` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `specialty` VARCHAR(100) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
    ADD PRIMARY KEY (`person_id`);

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `first_name`,
    DROP COLUMN `id`,
    DROP COLUMN `last_name`,
    ADD COLUMN `person_id` INTEGER UNSIGNED NOT NULL,
    ADD PRIMARY KEY (`person_id`);

-- CreateTable
CREATE TABLE `person` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dni` CHAR(8) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(12) NULL,
    `birth_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `person_dni_key`(`dni`),
    UNIQUE INDEX `person_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `professor_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offering` ADD CONSTRAINT `course_offering_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `professor`(`person_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`person_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
