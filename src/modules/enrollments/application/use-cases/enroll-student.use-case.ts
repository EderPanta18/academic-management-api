// modules/enrollments/application/use-cases/enroll-student.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@core/exceptions';
import {
  STUDENT_FINDER_PORT,
  type IStudentFinder,
} from '@students/domain/ports/in';
import {
  COURSE_OFFERING_FINDER_PORT,
  type ICourseOfferingFinder,
} from '@course-offerings/domain/ports/in';
import { Enrollment } from '@enrollments/domain/entities';
import {
  EnrollmentDuplicateException,
  EnrollmentCapacityExceededException,
} from '@enrollments/domain/exceptions';
import {
  ENROLLMENT_REPOSITORY_PORT,
  type IEnrollmentRepository,
} from '@enrollments/domain/ports/out';
import {
  StudentNotActiveForEnrollmentException,
  CourseOfferingNotOpenException,
  EnrollmentCareerMismatchException,
} from '../exceptions';
import { EnrollStudentCommand } from '../commands';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(STUDENT_FINDER_PORT)
    private readonly studentFinder: IStudentFinder,

    @Inject(COURSE_OFFERING_FINDER_PORT)
    private readonly courseOfferingFinder: ICourseOfferingFinder,

    @Inject(ENROLLMENT_REPOSITORY_PORT)
    private readonly repository: IEnrollmentRepository,
  ) {}

  async execute(command: EnrollStudentCommand): Promise<Enrollment> {
    const studentExists = await this.studentFinder.exists(command.studentId);
    if (!studentExists)
      throw new EntityNotFoundException('Student', command.studentId);

    const offeringExists = await this.courseOfferingFinder.exists(
      command.courseOfferingId,
    );
    if (!offeringExists)
      throw new EntityNotFoundException(
        'CourseOffering',
        command.courseOfferingId,
      );

    // Estado del alumno
    const studentActive = await this.studentFinder.isActive(command.studentId);
    if (!studentActive)
      throw new StudentNotActiveForEnrollmentException(command.studentId);

    // Oferta abierta
    const offeringOpen = await this.courseOfferingFinder.isOpenForEnrollment(
      command.courseOfferingId,
    );
    if (!offeringOpen)
      throw new CourseOfferingNotOpenException(command.courseOfferingId);

    // Misma carrera
    const studentCareerId = await this.studentFinder.getCareerIdByStudentId(
      command.studentId,
    );
    const courseCareerId =
      await this.courseOfferingFinder.getCourseCareerIdByOfferingId(
        command.courseOfferingId,
      );
    if (studentCareerId !== courseCareerId)
      throw new EnrollmentCareerMismatchException(
        command.studentId,
        command.courseOfferingId,
      );

    // Doble inscripción
    const duplicate = await this.repository.existsByStudentAndOffering(
      command.studentId,
      command.courseOfferingId,
    );
    if (duplicate)
      throw new EnrollmentDuplicateException(
        command.studentId,
        command.courseOfferingId,
      );

    // Capacidad
    const atCapacity = await this.repository.isAtCapacity(
      command.courseOfferingId,
    );
    if (atCapacity)
      throw new EnrollmentCapacityExceededException(command.courseOfferingId);

    const enrollment = Enrollment.create({
      studentId: command.studentId,
      courseOfferingId: command.courseOfferingId,
      enrollmentDate: command.enrollmentDate,
      createdBy: command.createdBy,
    });

    return this.repository.save(enrollment);
  }
}
