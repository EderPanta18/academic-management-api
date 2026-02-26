// prisma/seeds/enrollment.seed.ts

import { PrismaClient, EnrollmentStatus } from '@prisma/client';
import * as data from '../data';
import type { AcademicMaps } from './types';

export async function seedEnrollments(
  prisma: PrismaClient,
  academicMaps: AcademicMaps,
) {
  console.log('\nPoblando inscripciones ....');
  const { studentMap, offeringMap } = academicMaps;

  const enrollmentMap = await seedEnrollmentsCore(
    prisma,
    studentMap,
    offeringMap,
    data.enrollments,
  );

  await seedEnrollmentStatusLogs(
    prisma,
    enrollmentMap,
    data.enrollmentStatusLogs,
  );

  console.log('Enrollment maps creados:');
  console.log('- Enrollments:', enrollmentMap.size);
  console.log('- Status Logs:', data.enrollmentStatusLogs.length);
}

// ─── Helpers atómicos ─────────────────────────────────────────────────

async function seedEnrollmentsCore(
  prisma: PrismaClient,
  studentMap: Map<string, number>,
  offeringMap: Map<string, number>,
  enrollments: any[],
) {
  const enrollmentMap = new Map<string, number>();
  let seeded = 0;

  for (const e of enrollments) {
    const offeringKey = `${e.courseName}-${e.academicPeriodName}-${e.section}`;
    const studentId = studentMap.get(e.studentCode);
    const offeringId = offeringMap.get(offeringKey);

    if (!studentId || !offeringId) continue;

    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_courseOfferingId: {
          studentId,
          courseOfferingId: offeringId,
        },
      },
      update: {},
      create: {
        studentId,
        courseOfferingId: offeringId,
        status: e.status as EnrollmentStatus,
        enrollmentDate: new Date(e.enrollmentDate),
        createdBy: null,
      },
    });

    enrollmentMap.set(`${e.studentCode}-${offeringKey}`, enrollment.id);
    seeded++;
  }

  return enrollmentMap;
}

async function seedEnrollmentStatusLogs(
  prisma: PrismaClient,
  enrollmentMap: Map<string, number>,
  logsData: any[],
) {
  const logs: {
    enrollmentId: number;
    previousStatus: EnrollmentStatus | null;
    newStatus: EnrollmentStatus;
    reason: string | null;
    changedBy: number | null;
  }[] = [];

  let processed = 0;
  for (const logData of logsData) {
    const enrollmentKey = `${logData.enrollment.studentCode}-${logData.enrollment.courseName}-${logData.enrollment.academicPeriodName}-${logData.enrollment.section}`;
    const enrollmentId = enrollmentMap.get(enrollmentKey);

    if (!enrollmentId) {
      console.warn(`Omitiendo registro: inscripción="${enrollmentKey}"`);
      continue;
    }

    logs.push({
      enrollmentId,
      previousStatus: logData.previousStatus
        ? (logData.previousStatus as EnrollmentStatus)
        : null,
      newStatus: logData.newStatus as EnrollmentStatus,
      reason: logData.reason ?? null,
      changedBy: logData.changedBy ?? null,
    });
    processed++;
  }

  if (logs.length > 0) {
    await prisma.enrollmentStatusLog.createMany({
      data: logs,
      skipDuplicates: true,
    });
  }
}
