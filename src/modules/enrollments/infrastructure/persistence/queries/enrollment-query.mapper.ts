import type { EnrollmentReadModel } from '@enrollments/application/read-models';
import type { EnrollmentStatus } from '@enrollments/domain/entities';
import type { Prisma } from '@prisma/client';

export type EnrollmentReadRaw = Prisma.EnrollmentGetPayload<{
  include: {
    student: { include: { person: true } };
    courseOffering: {
      include: {
        course: true;
        academicPeriod: true;
      };
    };
    registeredByUser: true;
  };
}>;

export class EnrollmentQueryMapper {
  static toReadModel(raw: EnrollmentReadRaw): EnrollmentReadModel {
    return {
      id: raw.id,
      studentId: raw.studentId,
      courseOfferingId: raw.courseOfferingId,
      registeredByUserId: raw.registeredByUserId,
      status: raw.status as EnrollmentStatus,
      enrolledAt: raw.enrolledAt,
      statusReason: raw.statusReason,

      studentCode: raw.student.code,
      studentFirstName: raw.student.person.firstName,
      studentLastName: raw.student.person.lastName,

      courseId: raw.courseOffering.course.id,
      courseCode: raw.courseOffering.course.code,
      courseName: raw.courseOffering.course.name,

      section: raw.courseOffering.section,

      academicPeriodId: raw.courseOffering.academicPeriod.id,
      academicPeriodCode: raw.courseOffering.academicPeriod.code,
      academicPeriodName: raw.courseOffering.academicPeriod.name,

      registeredByUserEmail: raw.registeredByUser.email,
    };
  }
}
