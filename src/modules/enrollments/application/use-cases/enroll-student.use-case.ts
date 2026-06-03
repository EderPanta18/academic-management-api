// modules/enrollments/application/use-cases/enroll-student.use-case.ts

import { EntityNotFoundException } from '@core/exceptions';
import {
  COURSE_OFFERING_FINDER_PORT,
  type ICourseOfferingFinder,
} from '@course-offerings/application/ports/in';
import {
  ENROLLMENT_REPOSITORY_PORT,
  type IEnrollmentRepository,
} from '@enrollments/application/ports/out';
import { Enrollment } from '@enrollments/domain/entities';
import {
  EnrollmentCapacityExceededException,
  EnrollmentDuplicateException,
} from '@enrollments/domain/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { type IStudentFinder, STUDENT_FINDER_PORT } from '@students/application/ports/in';
import { EnrollStudentCommand } from '../commands';
import {
  CourseOfferingNotOpenException,
  EnrollmentCareerMismatchException,
  StudentNotActiveForEnrollmentException,
} from '../exceptions';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(STUDENT_FINDER_PORT)
    private readonly studentFinder: IStudentFinder,

    @Inject(COURSE_OFFERING_FINDER_PORT)
    private readonly courseOfferingFinder: ICourseOfferingFinder,

    @Inject(ENROLLMENT_REPOSITORY_PORT)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(command: EnrollStudentCommand): Promise<Enrollment> {
    const studentExists = await this.studentFinder.exists(command.studentId);

    if (!studentExists) throw new EntityNotFoundException('Student', command.studentId);

    const offeringExists = await this.courseOfferingFinder.exists(command.courseOfferingId);

    if (!offeringExists)
      throw new EntityNotFoundException('CourseOffering', command.courseOfferingId);

    const studentActive = await this.studentFinder.isActive(command.studentId);

    if (!studentActive) throw new StudentNotActiveForEnrollmentException(command.studentId);

    const offeringOpen = await this.courseOfferingFinder.isOpenForEnrollment(
      command.courseOfferingId,
    );

    if (!offeringOpen) throw new CourseOfferingNotOpenException(command.courseOfferingId);

    const studentCareerId = await this.studentFinder.getCareerIdByStudentId(command.studentId);

    const courseCareerId = await this.courseOfferingFinder.getCourseCareerIdByOfferingId(
      command.courseOfferingId,
    );

    if (studentCareerId !== courseCareerId)
      throw new EnrollmentCareerMismatchException(command.studentId, command.courseOfferingId);

    const duplicate = await this.enrollmentRepository.existsByStudentAndOffering(
      command.studentId,
      command.courseOfferingId,
    );

    if (duplicate)
      throw new EnrollmentDuplicateException(command.studentId, command.courseOfferingId);

    const atCapacity = await this.enrollmentRepository.isAtCapacity(command.courseOfferingId);

    if (atCapacity) throw new EnrollmentCapacityExceededException(command.courseOfferingId);

    const enrollment = Enrollment.create({
      studentId: command.studentId,
      courseOfferingId: command.courseOfferingId,
      enrollmentDate: command.enrollmentDate,
      createdBy: command.createdBy,
    });

    return this.enrollmentRepository.save(enrollment);
  }
}
