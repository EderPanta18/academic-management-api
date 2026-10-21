import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import {
  COURSE_OFFERING_CHECKER_TOKEN,
  COURSE_OFFERING_FINDER_TOKEN,
  type ICourseOfferingChecker,
  type ICourseOfferingFinder,
} from '@course-offerings';
import { COURSE_FINDER_TOKEN, type ICourseFinder } from '@courses';
import { Enrollment, EnrollmentStatus } from '@enrollments/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStudentChecker,
  type IStudentFinder,
  STUDENT_CHECKER_TOKEN,
  STUDENT_FINDER_TOKEN,
} from '@students';
import type { EnrollStudentCommand } from '../commands';
import {
  EnrollmentCourseOfferingAtCapacityException,
  EnrollmentCourseOfferingNotFoundException,
  EnrollmentCourseOfferingNotOpenException,
  EnrollmentStudentAlreadyEnrolledException,
  EnrollmentStudentNotActiveException,
  EnrollmentStudentNotFoundException,
  EnrollmentStudentNotInCourseAcademicProgramException,
} from '../exceptions';
import { ENROLLMENT_REPOSITORY_TOKEN, type IEnrollmentRepository } from '../ports/out';

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(STUDENT_CHECKER_TOKEN)
    private readonly studentChecker: IStudentChecker,

    @Inject(STUDENT_FINDER_TOKEN)
    private readonly studentFinder: IStudentFinder,

    @Inject(COURSE_FINDER_TOKEN)
    private readonly courseFinder: ICourseFinder,

    @Inject(COURSE_OFFERING_CHECKER_TOKEN)
    private readonly courseOfferingChecker: ICourseOfferingChecker,

    @Inject(COURSE_OFFERING_FINDER_TOKEN)
    private readonly courseOfferingFinder: ICourseOfferingFinder,

    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(command: EnrollStudentCommand): Promise<Enrollment> {
    const studentExists = await this.studentChecker.exists(command.studentId);

    if (!studentExists) throw new EnrollmentStudentNotFoundException(command.studentId);

    const studentIsActive = await this.studentChecker.isActive(command.studentId);

    if (!studentIsActive) throw new EnrollmentStudentNotActiveException(command.studentId);

    const offeringExists = await this.courseOfferingChecker.exists(command.courseOfferingId);

    if (!offeringExists)
      throw new EnrollmentCourseOfferingNotFoundException(command.courseOfferingId);

    // Oferta abierta
    const offeringIsOpen = await this.courseOfferingChecker.isOpen(command.courseOfferingId);

    if (!offeringIsOpen)
      throw new EnrollmentCourseOfferingNotOpenException(command.courseOfferingId);

    // Compatibilidad de programa académico
    const studentAcademicProgramId = await this.studentFinder.getAcademicProgramId(
      command.studentId,
    );

    const courseId = await this.courseOfferingFinder.getCourseId(command.courseOfferingId);

    if (!courseId) throw new EnrollmentCourseOfferingNotFoundException(command.courseOfferingId);

    const courseAcademicProgramId = await this.courseFinder.getAcademicProgramId(courseId);

    if (!courseAcademicProgramId)
      throw new EnrollmentCourseOfferingNotFoundException(command.courseOfferingId);

    if (studentAcademicProgramId !== courseAcademicProgramId)
      throw new EnrollmentStudentNotInCourseAcademicProgramException(
        command.studentId,
        courseAcademicProgramId,
      );

    // Sin duplicado
    const duplicate = await this.enrollmentRepository.existsByStudentAndOffering(
      command.studentId,
      command.courseOfferingId,
    );

    if (duplicate)
      throw new EnrollmentStudentAlreadyEnrolledException(
        command.studentId,
        command.courseOfferingId,
      );

    // Capacidad (solo si quedará en estado ENROLLED)
    const willBeEnrolled =
      (command.status ?? EnrollmentStatus.ENROLLED) === EnrollmentStatus.ENROLLED;

    if (willBeEnrolled) {
      const hasCapacity = await this.courseOfferingChecker.hasAvailableCapacity(
        command.courseOfferingId,
      );

      if (!hasCapacity)
        throw new EnrollmentCourseOfferingAtCapacityException(command.courseOfferingId);
    }

    const enrollmentId = this.idGenerator.generate();

    const enrollment = Enrollment.create({
      id: enrollmentId,
      studentId: command.studentId,
      courseOfferingId: command.courseOfferingId,
      registeredByUserId: command.registeredByUserId,
      enrolledAt: command.enrolledAt,
      status: command.status,
      statusReason: command.statusReason,
    });

    return await this.enrollmentRepository.create(enrollment);
  }
}
