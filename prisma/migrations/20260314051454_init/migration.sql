-- CreateTable
CREATE TABLE `person` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dni` CHAR(8) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` CHAR(9) NULL,
    `birth_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `person_dni_key`(`dni`),
    UNIQUE INDEX `person_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `department_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `career` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `department_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `total_credits` SMALLINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `career_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_period` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `year` YEAR NOT NULL,
    `semester` TINYINT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `academic_period_name_key`(`name`),
    UNIQUE INDEX `academic_period_year_semester_key`(`year`, `semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor` (
    `person_id` INTEGER UNSIGNED NOT NULL,
    `department_id` INTEGER UNSIGNED NULL,
    `code` VARCHAR(20) NOT NULL,
    `specialty` VARCHAR(100) NULL,
    `institutional_email` VARCHAR(150) NULL,
    `hire_date` DATE NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `professor_code_key`(`code`),
    UNIQUE INDEX `professor_institutional_email_key`(`institutional_email`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `person_id` INTEGER UNSIGNED NOT NULL,
    `career_id` INTEGER UNSIGNED NOT NULL,
    `code` CHAR(10) NOT NULL,
    `institutional_email` VARCHAR(150) NULL,
    `enrollment_date` DATE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `student_code_key`(`code`),
    UNIQUE INDEX `student_institutional_email_key`(`institutional_email`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `course_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `career_id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NULL,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `credits` TINYINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `course_career_id_name_key`(`career_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_offering` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER UNSIGNED NOT NULL,
    `academic_period_id` INTEGER UNSIGNED NOT NULL,
    `professor_id` INTEGER UNSIGNED NULL,
    `section` VARCHAR(10) NOT NULL DEFAULT 'A',
    `max_students` SMALLINT NOT NULL DEFAULT 30,
    `enrollment_deadline` DATE NULL,
    `status` ENUM('INACTIVE', 'ACTIVE', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'INACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `course_offering_course_id_academic_period_id_section_key`(`course_id`, `academic_period_id`, `section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER UNSIGNED NOT NULL,
    `course_offering_id` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'ENROLLED',
    `enrollment_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `enrollment_student_id_course_offering_id_key`(`student_id`, `course_offering_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollment_status_log` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `enrollment_id` INTEGER UNSIGNED NOT NULL,
    `previous_status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NULL,
    `new_status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NOT NULL,
    `reason` TEXT NULL,
    `changed_by` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `career` ADD CONSTRAINT `career_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `professor_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `professor_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_career_id_fkey` FOREIGN KEY (`career_id`) REFERENCES `career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_career_id_fkey` FOREIGN KEY (`career_id`) REFERENCES `career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `course_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offering` ADD CONSTRAINT `course_offering_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offering` ADD CONSTRAINT `course_offering_academic_period_id_fkey` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offering` ADD CONSTRAINT `course_offering_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `professor`(`person_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`person_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_course_offering_id_fkey` FOREIGN KEY (`course_offering_id`) REFERENCES `course_offering`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment_status_log` ADD CONSTRAINT `enrollment_status_log_enrollment_id_fkey` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
