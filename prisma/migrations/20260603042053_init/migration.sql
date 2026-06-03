-- CreateEnum
CREATE TYPE "ProfessorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CourseOfferingStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ENROLLED', 'WITHDRAWN', 'COMPLETED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "dni" CHAR(8) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" CHAR(9),
    "birth_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "total_credits" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_period" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "year" SMALLINT NOT NULL,
    "semester" SMALLINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "academic_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor" (
    "person_id" INTEGER NOT NULL,
    "department_id" INTEGER,
    "code" VARCHAR(20) NOT NULL,
    "specialty" VARCHAR(100),
    "institutional_email" VARCHAR(150),
    "hire_date" DATE,
    "status" "ProfessorStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "professor_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "student" (
    "person_id" INTEGER NOT NULL,
    "career_id" INTEGER NOT NULL,
    "code" CHAR(10) NOT NULL,
    "institutional_email" VARCHAR(150),
    "enrollment_date" DATE NOT NULL,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "student_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "course_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "course_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "career_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "credits" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_offering" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "academic_period_id" INTEGER NOT NULL,
    "professor_id" INTEGER,
    "section" VARCHAR(10) NOT NULL DEFAULT 'A',
    "max_students" SMALLINT NOT NULL DEFAULT 30,
    "enrollment_deadline" DATE,
    "status" "CourseOfferingStatus" NOT NULL DEFAULT 'INACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "course_offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_offering_id" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "enrollment_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_status_log" (
    "id" SERIAL NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "previous_status" "EnrollmentStatus",
    "new_status" "EnrollmentStatus" NOT NULL,
    "reason" TEXT,
    "changed_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_status_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_dni_key" ON "person"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "career_name_key" ON "career"("name");

-- CreateIndex
CREATE UNIQUE INDEX "academic_period_name_key" ON "academic_period"("name");

-- CreateIndex
CREATE UNIQUE INDEX "academic_period_year_semester_key" ON "academic_period"("year", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "professor_code_key" ON "professor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "professor_institutional_email_key" ON "professor"("institutional_email");

-- CreateIndex
CREATE UNIQUE INDEX "student_code_key" ON "student"("code");

-- CreateIndex
CREATE UNIQUE INDEX "student_institutional_email_key" ON "student"("institutional_email");

-- CreateIndex
CREATE UNIQUE INDEX "course_category_name_key" ON "course_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_career_id_name_key" ON "course"("career_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "course_offering_course_id_academic_period_id_section_key" ON "course_offering"("course_id", "academic_period_id", "section");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_student_id_course_offering_id_key" ON "enrollment"("student_id", "course_offering_id");

-- AddForeignKey
ALTER TABLE "career" ADD CONSTRAINT "career_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offering" ADD CONSTRAINT "course_offering_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offering" ADD CONSTRAINT "course_offering_academic_period_id_fkey" FOREIGN KEY ("academic_period_id") REFERENCES "academic_period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offering" ADD CONSTRAINT "course_offering_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("person_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "course_offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_status_log" ADD CONSTRAINT "enrollment_status_log_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
