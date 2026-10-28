-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'WITHDRAWN', 'GRADUATED');

-- CreateEnum
CREATE TYPE "ProfessorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "AcademicPeriodStatus" AS ENUM ('PLANNED', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CourseOfferingStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ENROLLED', 'CANCELLED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EnrollmentMovementType" AS ENUM ('CREATED', 'CANCELLED', 'WITHDRAWN', 'SECTION_CHANGED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "StudentImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED');

-- CreateEnum
CREATE TYPE "StudentImportResultStatus" AS ENUM ('ACCEPTED', 'DUPLICATE', 'REJECTED');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PUBLISHED');

-- CreateTable
CREATE TABLE "document_types" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL,
    "documentTypeId" UUID NOT NULL,
    "documentNumber" VARCHAR(50) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "birthDate" DATE,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculties" (
    "id" UUID NOT NULL,
    "acronym" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_departments" (
    "id" UUID NOT NULL,
    "facultyId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "academic_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_programs" (
    "id" UUID NOT NULL,
    "facultyId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_program_courses" (
    "id" UUID NOT NULL,
    "academicProgramId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "validFrom" TIMESTAMPTZ(6) NOT NULL,
    "validUntil" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_program_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "academicProgramId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "institutionalEmail" VARCHAR(255),
    "admissionPeriod" VARCHAR(50),
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professors" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "facultyId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "institutionalEmail" VARCHAR(255),
    "specialty" VARCHAR(100),
    "status" "ProfessorStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_categories" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "academicDepartmentId" UUID NOT NULL,
    "courseCategoryId" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "credits" INTEGER NOT NULL,
    "hours" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_periods" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "enrollmentStartDate" DATE NOT NULL,
    "enrollmentEndDate" DATE NOT NULL,
    "status" "AcademicPeriodStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "academic_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_offerings" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "academicPeriodId" UUID NOT NULL,
    "professorId" UUID,
    "section" VARCHAR(20) NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "status" "CourseOfferingStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "course_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "courseOfferingId" UUID NOT NULL,
    "academicProgramId" UUID NOT NULL,
    "status" "EnrollmentStatus" NOT NULL,
    "enrolledAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registeredByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_movements" (
    "id" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "movementType" "EnrollmentMovementType" NOT NULL,
    "previousStatus" "EnrollmentStatus",
    "newStatus" "EnrollmentStatus",
    "previousCourseOfferingId" UUID,
    "newCourseOfferingId" UUID,
    "correctionOfMovementId" UUID,
    "reason" TEXT,
    "performedByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "personId" UUID,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "module" VARCHAR(100) NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "accessTokenJti" VARCHAR(255),
    "deviceName" VARCHAR(255),
    "ipAddress" VARCHAR(64),
    "userAgent" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "revokedAt" TIMESTAMPTZ(6),
    "lastUsedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(100) NOT NULL,
    "resourceId" VARCHAR(100),
    "module" VARCHAR(100),
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_imports" (
    "id" UUID NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileExtension" VARCHAR(10) NOT NULL,
    "fileHash" VARCHAR(64) NOT NULL,
    "fileContent" BYTEA NOT NULL,
    "fileMimeType" VARCHAR(150),
    "status" "StudentImportStatus" NOT NULL DEFAULT 'PENDING',
    "totalRows" INTEGER,
    "failureReason" TEXT,
    "createdByUserId" UUID NOT NULL,
    "startedAt" TIMESTAMPTZ(6),
    "finishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "student_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_import_results" (
    "studentImportId" UUID NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "status" "StudentImportResultStatus" NOT NULL,
    "studentId" UUID,
    "errorDetails" JSONB,
    "processedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_import_results_pkey" PRIMARY KEY ("studentImportId","rowNumber")
);

-- CreateTable
CREATE TABLE "outbox_messages" (
    "id" UUID NOT NULL,
    "messageKey" VARCHAR(150) NOT NULL,
    "eventName" VARCHAR(150) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMPTZ(6),
    "publishedAt" TIMESTAMPTZ(6),
    "lastError" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "persons_documentNumber_idx" ON "persons"("documentNumber");

-- CreateIndex
CREATE INDEX "persons_deletedAt_idx" ON "persons"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "persons_documentTypeId_documentNumber_key" ON "persons"("documentTypeId", "documentNumber");

-- CreateIndex
CREATE INDEX "faculties_deletedAt_idx" ON "faculties"("deletedAt");

-- CreateIndex
CREATE INDEX "academic_departments_facultyId_idx" ON "academic_departments"("facultyId");

-- CreateIndex
CREATE INDEX "academic_departments_deletedAt_idx" ON "academic_departments"("deletedAt");

-- CreateIndex
CREATE INDEX "academic_programs_facultyId_idx" ON "academic_programs"("facultyId");

-- CreateIndex
CREATE INDEX "academic_programs_deletedAt_idx" ON "academic_programs"("deletedAt");

-- CreateIndex
CREATE INDEX "academic_program_courses_academicProgramId_courseId_validFr_idx" ON "academic_program_courses"("academicProgramId", "courseId", "validFrom");

-- CreateIndex
CREATE INDEX "academic_program_courses_courseId_idx" ON "academic_program_courses"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "students_personId_key" ON "students"("personId");

-- CreateIndex
CREATE INDEX "students_academicProgramId_idx" ON "students"("academicProgramId");

-- CreateIndex
CREATE INDEX "students_status_idx" ON "students"("status");

-- CreateIndex
CREATE INDEX "students_deletedAt_idx" ON "students"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "professors_personId_key" ON "professors"("personId");

-- CreateIndex
CREATE INDEX "professors_facultyId_idx" ON "professors"("facultyId");

-- CreateIndex
CREATE INDEX "professors_status_idx" ON "professors"("status");

-- CreateIndex
CREATE INDEX "professors_deletedAt_idx" ON "professors"("deletedAt");

-- CreateIndex
CREATE INDEX "courses_academicDepartmentId_idx" ON "courses"("academicDepartmentId");

-- CreateIndex
CREATE INDEX "courses_courseCategoryId_idx" ON "courses"("courseCategoryId");

-- CreateIndex
CREATE INDEX "courses_deletedAt_idx" ON "courses"("deletedAt");

-- CreateIndex
CREATE INDEX "academic_periods_status_idx" ON "academic_periods"("status");

-- CreateIndex
CREATE INDEX "academic_periods_deletedAt_idx" ON "academic_periods"("deletedAt");

-- CreateIndex
CREATE INDEX "course_offerings_academicPeriodId_idx" ON "course_offerings"("academicPeriodId");

-- CreateIndex
CREATE INDEX "course_offerings_professorId_idx" ON "course_offerings"("professorId");

-- CreateIndex
CREATE INDEX "course_offerings_status_idx" ON "course_offerings"("status");

-- CreateIndex
CREATE INDEX "course_offerings_deletedAt_idx" ON "course_offerings"("deletedAt");

-- CreateIndex
CREATE INDEX "enrollments_studentId_status_idx" ON "enrollments"("studentId", "status");

-- CreateIndex
CREATE INDEX "enrollments_courseOfferingId_status_idx" ON "enrollments"("courseOfferingId", "status");

-- CreateIndex
CREATE INDEX "enrollments_academicProgramId_idx" ON "enrollments"("academicProgramId");

-- CreateIndex
CREATE INDEX "enrollments_registeredByUserId_idx" ON "enrollments"("registeredByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_movements_correctionOfMovementId_key" ON "enrollment_movements"("correctionOfMovementId");

-- CreateIndex
CREATE INDEX "enrollment_movements_enrollmentId_createdAt_idx" ON "enrollment_movements"("enrollmentId", "createdAt");

-- CreateIndex
CREATE INDEX "enrollment_movements_performedByUserId_idx" ON "enrollment_movements"("performedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_personId_key" ON "users"("personId");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_accessTokenJti_key" ON "user_sessions"("accessTokenJti");

-- CreateIndex
CREATE INDEX "user_sessions_userId_status_idx" ON "user_sessions"("userId", "status");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_createdAt_idx" ON "audit_logs"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "student_imports_status_createdAt_idx" ON "student_imports"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "student_imports_createdByUserId_fileHash_key" ON "student_imports"("createdByUserId", "fileHash");

-- CreateIndex
CREATE INDEX "student_import_results_studentId_idx" ON "student_import_results"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_messages_messageKey_key" ON "outbox_messages"("messageKey");

-- CreateIndex
CREATE INDEX "outbox_messages_status_nextAttemptAt_idx" ON "outbox_messages"("status", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_departments" ADD CONSTRAINT "academic_departments_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_academicProgramId_fkey" FOREIGN KEY ("academicProgramId") REFERENCES "academic_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicProgramId_fkey" FOREIGN KEY ("academicProgramId") REFERENCES "academic_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_courseCategoryId_fkey" FOREIGN KEY ("courseCategoryId") REFERENCES "course_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_academicPeriodId_fkey" FOREIGN KEY ("academicPeriodId") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "course_offerings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_academicProgramId_fkey" FOREIGN KEY ("academicProgramId") REFERENCES "academic_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_previousCourseOfferingId_fkey" FOREIGN KEY ("previousCourseOfferingId") REFERENCES "course_offerings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_newCourseOfferingId_fkey" FOREIGN KEY ("newCourseOfferingId") REFERENCES "course_offerings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_performedByUserId_fkey" FOREIGN KEY ("performedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_correctionOfMovementId_fkey" FOREIGN KEY ("correctionOfMovementId") REFERENCES "enrollment_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_imports" ADD CONSTRAINT "student_imports_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_import_results" ADD CONSTRAINT "student_import_results_studentImportId_fkey" FOREIGN KEY ("studentImportId") REFERENCES "student_imports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_import_results" ADD CONSTRAINT "student_import_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Extensiones y restricciones complementarias de la PRIMERA migracion.
-- Anexar al final del migration.sql inicial generado por Prisma 7.1.
-- Todas las tablas, enums, FK, claves primarias e indices ordinarios
-- deben haber sido creados previamente por la parte generada por Prisma.
-- Exclusivamente para una base vacia; no es una migracion incremental.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Unicidad de negocio entre vigentes: comparacion sin distinguir mayusculas
-- ni espacios exteriores. No se eliminan tildes ni espacios internos.
-- Los nombres de columnas son exactamente los del schema Prisma (camelCase).

CREATE UNIQUE INDEX "persons_active_email_uq"
  ON "persons" (lower(btrim("email")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "faculties_active_acronym_uq"
  ON "faculties" (lower(btrim("acronym")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "faculties_active_name_uq"
  ON "faculties" (lower(btrim("name")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_departments_active_code_uq"
  ON "academic_departments" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_programs_active_code_uq"
  ON "academic_programs" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "students_active_code_uq"
  ON "students" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "students_active_institutional_email_uq"
  ON "students" (lower(btrim("institutionalEmail")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "professors_active_code_uq"
  ON "professors" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "professors_active_institutional_email_uq"
  ON "professors" (lower(btrim("institutionalEmail")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "course_categories_active_code_uq"
  ON "course_categories" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "courses_active_code_uq"
  ON "courses" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_periods_active_code_uq"
  ON "academic_periods" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

-- Clave compuesta de oferta: la seccion se compara como identificador
-- literal; no se altera su semantica mediante una normalizacion no aprobada.
CREATE UNIQUE INDEX "course_offerings_active_section_uq"
  ON "course_offerings" ("courseId", "academicPeriodId", "section")
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "users_active_email_uq"
  ON "users" (lower(btrim("email")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "roles_active_code_uq"
  ON "roles" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

-- Catálogos sin baja lógica: unicidad GLOBAL, pero normalizada.
-- Prisma 7.1 no representa indices de expresion como @unique.
CREATE UNIQUE INDEX "document_types_normalized_code_uq"
  ON "document_types" (lower(btrim("code")));
CREATE UNIQUE INDEX "document_types_normalized_name_uq"
  ON "document_types" (lower(btrim("name")));
CREATE UNIQUE INDEX "permissions_normalized_code_uq"
  ON "permissions" (lower(btrim("code")));

-- Reglas de integridad no representables en Prisma Schema Language.
-- La extension debe estar disponible antes de crear la exclusion GiST.

ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_valid_range"
  CHECK ("validUntil" IS NULL OR "validUntil" > "validFrom");

ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_no_overlap"
  EXCLUDE USING gist (
  "academicProgramId" WITH =,
  "courseId" WITH =,
  tstzrange("validFrom", "validUntil", '[)') WITH &&
  );

ALTER TABLE "academic_periods" ADD CONSTRAINT "academic_periods_valid_dates"
  CHECK ("startDate" <= "endDate"
  AND "enrollmentStartDate" <= "enrollmentEndDate"
  AND "enrollmentEndDate" <= "endDate");

ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_capacity_positive"
  CHECK ("maxCapacity" > 0);

ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_open_has_professor"
  CHECK ("status" <> 'OPEN' OR "professorId" IS NOT NULL);

ALTER TABLE "student_import_results" ADD CONSTRAINT "student_import_results_row_positive"
  CHECK ("rowNumber" > 0);

ALTER TABLE "student_imports" ADD CONSTRAINT "student_imports_total_rows_nonnegative"
  CHECK ("totalRows" IS NULL OR "totalRows" >= 0);

ALTER TABLE "outbox_messages" ADD CONSTRAINT "outbox_messages_attempts_nonnegative"
  CHECK ("attemptCount" >= 0);

ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_reason_required"
  CHECK ("movementType" = 'CREATED' OR length(btrim(coalesce("reason", ''))) > 0);

-- Una unica sesion ACTIVE por usuario. Las sesiones anteriores se conservan.
CREATE UNIQUE INDEX "user_sessions_one_active_per_user"
  ON "user_sessions" ("userId")
  WHERE "status" = 'ACTIVE';

-- El tipo y numero de documento se fijan en el alta y son inmutables.
-- La UNIQUE global creada por Prisma no depende de deletedAt.
-- El trigger protege esta regla incluso frente a UPDATE SQL ordinarios.
CREATE FUNCTION prevent_person_document_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."documentTypeId" IS DISTINCT FROM OLD."documentTypeId"
    OR NEW."documentNumber" IS DISTINCT FROM OLD."documentNumber" THEN
    RAISE EXCEPTION 'Document type and number are immutable after person registration';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER persons_document_immutable
  BEFORE UPDATE ON "persons"
  FOR EACH ROW EXECUTE FUNCTION prevent_person_document_update();

-- La evidencia confirmada no puede editarse ni eliminarse por SQL ordinario.
CREATE FUNCTION prevent_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Historical evidence is append-only: %.%',
    TG_TABLE_SCHEMA, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER enrollment_movements_immutable
  BEFORE UPDATE OR DELETE ON "enrollment_movements"
  FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

CREATE TRIGGER audit_logs_immutable
  BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

-- Invariantes transversales que permanecen en transacciones SERIALIZABLE
-- de todos los escritores autorizados, con reintentos de serializacion:
-- cupos, inscripcion ENROLLED unica por alumno/curso/periodo (entre secciones),
-- rectificacion de retiros, proteccion de dependencias y bajas logicas,
-- precondiciones de cambios de estado y atributos de ofertas/periodos,
-- autorizacion de correcciones academicas, revocacion de sesiones.
-- Nunca eliminar ni reasignar evidencia historica por cascada.
