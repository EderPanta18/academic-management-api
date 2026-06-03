// prisma/seeds/academic.seed.ts

import {
  PrismaClient,
  ProfessorStatus,
  StudentStatus,
  CourseOfferingStatus
} from "@prisma/client";

import * as data from "../data";
import type { BaseMaps, AcademicMaps } from "./types";

export async function seedAcademicStructure(
  prisma: PrismaClient,
  baseMaps: BaseMaps
): Promise<AcademicMaps> {
  console.log("\nPoblando estructura académica ....");
  const { departmentMap, categoryMap, personMap, periodMap } = baseMaps;

  const careerMap = await seedCareers(prisma, departmentMap, data.careers);

  const professorMap = await seedProfessors(
    prisma,
    personMap,
    departmentMap,
    data.professors
  );

  const studentMap = await seedStudents(
    prisma,
    personMap,
    careerMap,
    data.students
  );

  const courseMap = await seedCourses(
    prisma,
    careerMap,
    categoryMap,
    data.courses
  );

  const offeringMap = await seedOfferings(
    prisma,
    courseMap,
    periodMap,
    professorMap,
    data.courseOfferings
  );

  const academicMaps: AcademicMaps = {
    ...baseMaps,
    careerMap,
    professorMap,
    studentMap,
    courseMap,
    offeringMap
  };

  console.log("Academic maps creados:");
  console.log("- Careers:", careerMap.size);
  console.log("- Professors:", professorMap.size);
  console.log("- Students:", studentMap.size);
  console.log("- Courses:", courseMap.size);
  console.log("- Offerings:", offeringMap.size);

  return academicMaps;
}

// ─── Helpers atómicos ─────────────────────────────────────────────────

async function seedCareers(
  prisma: PrismaClient,
  departmentMap: Map<string, number>,
  careers: any[]
) {
  const careerMap = new Map<string, number>();
  for (const c of careers) {
    const career = await prisma.career.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        totalCredits: c.totalCredits,
        departmentId: departmentMap.get(c.departmentName)!
      }
    });
    careerMap.set(c.name, career.id);
  }
  return careerMap;
}

async function seedProfessors(
  prisma: PrismaClient,
  personMap: Map<string, number>,
  departmentMap: Map<string, number>,
  professors: any[]
) {
  const professorMap = new Map<string, number>();
  for (const p of professors) {
    const professor = await prisma.professor.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        personId: personMap.get(p.dni)!,
        departmentId: departmentMap.get(p.departmentName) ?? null,
        specialty: p.specialty ?? null,
        institutionalEmail: p.institutionalEmail ?? null,
        hireDate: p.hireDate ? new Date(p.hireDate) : null,
        status: p.status as ProfessorStatus
      }
    });
    professorMap.set(p.code, professor.personId);
  }
  return professorMap;
}

async function seedStudents(
  prisma: PrismaClient,
  personMap: Map<string, number>,
  careerMap: Map<string, number>,
  students: any[]
) {
  const studentMap = new Map<string, number>();
  for (const s of students) {
    const student = await prisma.student.upsert({
      where: { code: s.code },
      update: {},
      create: {
        code: s.code,
        personId: personMap.get(s.dni)!,
        careerId: careerMap.get(s.careerName)!,
        institutionalEmail: s.institutionalEmail ?? null,
        enrollmentDate: new Date(s.enrollmentDate),
        status: s.status as StudentStatus
      }
    });
    studentMap.set(s.code, student.personId);
  }
  return studentMap;
}

async function seedCourses(
  prisma: PrismaClient,
  careerMap: Map<string, number>,
  categoryMap: Map<string, number>,
  courses: any[]
) {
  const courseMap = new Map<string, number>();
  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: {
        careerId_name: {
          careerId: careerMap.get(c.careerName)!,
          name: c.name
        }
      },
      update: {},
      create: {
        name: c.name,
        description: c.description ?? null,
        credits: c.credits,
        careerId: careerMap.get(c.careerName)!,
        categoryId: categoryMap.get(c.categoryName) ?? null
      }
    });
    courseMap.set(`${c.careerName}-${c.name}`, course.id);
  }
  return courseMap;
}

async function seedOfferings(
  prisma: PrismaClient,
  courseMap: Map<string, number>,
  periodMap: Map<string, number>,
  professorMap: Map<string, number>,
  offerings: any[]
) {
  const offeringMap = new Map<string, number>();
  for (const o of offerings) {
    const courseData = data.courses.find((c: any) => c.name === o.courseName);
    if (!courseData) continue;

    const courseId = courseMap.get(`${courseData.careerName}-${o.courseName}`)!;
    const offering = await prisma.courseOffering.upsert({
      where: {
        courseId_academicPeriodId_section: {
          courseId,
          academicPeriodId: periodMap.get(o.academicPeriodName)!,
          section: o.section
        }
      },
      update: {},
      create: {
        courseId,
        academicPeriodId: periodMap.get(o.academicPeriodName)!,
        professorId: professorMap.get(o.ProfessorCode) ?? null,
        section: o.section,
        maxStudents: o.maxStudents,
        enrollmentDeadline: o.enrollmentDeadline
          ? new Date(o.enrollmentDeadline)
          : null,
        status: o.status as CourseOfferingStatus
      }
    });
    offeringMap.set(
      `${o.courseName}-${o.academicPeriodName}-${o.section}`,
      offering.id
    );
  }
  return offeringMap;
}
