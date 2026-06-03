// prisma/seeds/base.seed.ts

import { PrismaClient } from "@prisma/client";

import * as data from "../data";
import type { BaseMaps } from "./types";

export async function seedBaseTables(prisma: PrismaClient): Promise<BaseMaps> {
  console.log("\nPoblando tablas base ....");

  await Promise.all([
    seedDepartments(prisma, data.departments),
    seedAcademicPeriods(prisma, data.academicPeriods),
    seedCourseCategories(prisma, data.courseCategories),
    seedPersons(prisma, data.persons)
  ]);

  const [departments, periods, categories, persons] = await Promise.all([
    prisma.department.findMany({ where: { deletedAt: null } }),
    prisma.academicPeriod.findMany({ where: { deletedAt: null } }),
    prisma.courseCategory.findMany({ where: { deletedAt: null } }),
    prisma.person.findMany({ where: { deletedAt: null } })
  ]);

  const maps: BaseMaps = {
    departmentMap: new Map(departments.map((d) => [d.name, d.id])),
    periodMap: new Map(periods.map((p) => [p.name, p.id])),
    categoryMap: new Map(categories.map((c) => [c.name, c.id])),
    personMap: new Map(persons.map((p) => [p.dni, p.id]))
  };

  console.log("Base maps creados:");
  console.log("- Departments:", maps.departmentMap.size);
  console.log("- Academic Periods:", maps.periodMap.size);
  console.log("- Course Categories:", maps.categoryMap.size);
  console.log("- Persons:", maps.personMap.size);

  return maps;
}

// ─── Helpers atómicos ─────────────────────────────────────────────────

async function seedDepartments(prisma: PrismaClient, departments: any[]) {
  for (const d of departments) {
    await prisma.department.upsert({
      where: { name: d.name },
      update: {},
      create: {
        name: d.name,
        description: d.description ?? null
      }
    });
  }
}

async function seedAcademicPeriods(prisma: PrismaClient, periods: any[]) {
  for (const p of periods) {
    await prisma.academicPeriod.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        year: p.year,
        semester: p.semester,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
        isCurrent: p.isCurrent ?? false
      }
    });
  }
}

async function seedCourseCategories(prisma: PrismaClient, categories: any[]) {
  for (const c of categories) {
    await prisma.courseCategory.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        description: c.description ?? null
      }
    });
  }
}

async function seedPersons(prisma: PrismaClient, persons: any[]) {
  for (const p of persons) {
    await prisma.person.upsert({
      where: { dni: p.dni },
      update: {},
      create: {
        dni: p.dni,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone ?? null,
        birthDate: p.birthDate ? new Date(p.birthDate) : null
      }
    });
  }
}
