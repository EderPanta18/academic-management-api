SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS `academic_management_db`;
CREATE DATABASE `academic_management_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `academic_management_db`;

CREATE TABLE `person` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dni` CHAR(8) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` CHAR(9) NULL,
  `birth_date` DATE NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_person_dni` (`dni`),
  UNIQUE KEY `uk_person_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `department` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_department_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_category` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_course_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `academic_period` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `year` YEAR NOT NULL,
  `semester` TINYINT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `is_current` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_academic_period_name` (`name`),
  UNIQUE KEY `uk_academic_period_year_semester` (`year`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `career` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `total_credits` SMALLINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_career_name` (`name`),
  KEY `idx_career_department_id` (`department_id`),
  CONSTRAINT `fk_career_department`
    FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `professor` (
  `person_id` INT UNSIGNED NOT NULL,
  `department_id` INT UNSIGNED NULL,
  `code` VARCHAR(20) NOT NULL,
  `specialty` VARCHAR(100) NULL,
  `institutional_email` VARCHAR(150) NULL,
  `hire_date` DATE NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `uk_professor_code` (`code`),
  UNIQUE KEY `uk_professor_institutional_email` (`institutional_email`),
  KEY `idx_professor_department_id` (`department_id`),
  CONSTRAINT `fk_professor_person`
    FOREIGN KEY (`person_id`) REFERENCES `person` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_professor_department`
    FOREIGN KEY (`department_id`) REFERENCES `department` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `student` (
  `person_id` INT UNSIGNED NOT NULL,
  `career_id` INT UNSIGNED NOT NULL,
  `code` CHAR(10) NOT NULL,
  `institutional_email` VARCHAR(150) NULL,
  `enrollment_date` DATE NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `uk_student_code` (`code`),
  UNIQUE KEY `uk_student_institutional_email` (`institutional_email`),
  KEY `idx_student_career_id` (`career_id`),
  CONSTRAINT `fk_student_person`
    FOREIGN KEY (`person_id`) REFERENCES `person` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_student_career`
    FOREIGN KEY (`career_id`) REFERENCES `career` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `career_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `credits` TINYINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_course_career_name` (`career_id`, `name`),
  KEY `idx_course_career_id` (`career_id`),
  KEY `idx_course_category_id` (`category_id`),
  CONSTRAINT `fk_course_career`
    FOREIGN KEY (`career_id`) REFERENCES `career` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_course_category`
    FOREIGN KEY (`category_id`) REFERENCES `course_category` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_offering` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` INT UNSIGNED NOT NULL,
  `academic_period_id` INT UNSIGNED NOT NULL,
  `professor_id` INT UNSIGNED NULL,
  `section` VARCHAR(10) NOT NULL DEFAULT 'A',
  `max_students` SMALLINT NOT NULL DEFAULT 30,
  `enrollment_deadline` DATE NULL,
  `status` ENUM('INACTIVE', 'ACTIVE', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'INACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_course_offering_course_period_section` (`course_id`, `academic_period_id`, `section`),
  KEY `idx_course_offering_course_id` (`course_id`),
  KEY `idx_course_offering_academic_period_id` (`academic_period_id`),
  KEY `idx_course_offering_professor_id` (`professor_id`),
  CONSTRAINT `fk_course_offering_course`
    FOREIGN KEY (`course_id`) REFERENCES `course` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_course_offering_academic_period`
    FOREIGN KEY (`academic_period_id`) REFERENCES `academic_period` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_course_offering_professor`
    FOREIGN KEY (`professor_id`) REFERENCES `professor` (`person_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `enrollment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `course_offering_id` INT UNSIGNED NOT NULL,
  `status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'ENROLLED',
  `enrollment_date` DATE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `created_by` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_enrollment_student_offering` (`student_id`, `course_offering_id`),
  KEY `idx_enrollment_student_id` (`student_id`),
  KEY `idx_enrollment_course_offering_id` (`course_offering_id`),
  KEY `idx_enrollment_created_by` (`created_by`),
  CONSTRAINT `fk_enrollment_student`
    FOREIGN KEY (`student_id`) REFERENCES `student` (`person_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_enrollment_course_offering`
    FOREIGN KEY (`course_offering_id`) REFERENCES `course_offering` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `enrollment_status_log` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enrollment_id` INT UNSIGNED NOT NULL,
  `previous_status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NULL,
  `new_status` ENUM('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED') NOT NULL,
  `reason` TEXT NULL,
  `changed_by` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enrollment_status_log_enrollment_id` (`enrollment_id`),
  KEY `idx_enrollment_status_log_changed_by` (`changed_by`),
  CONSTRAINT `fk_enrollment_status_log_enrollment`
    FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
