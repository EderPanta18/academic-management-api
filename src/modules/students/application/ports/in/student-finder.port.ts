// modules/students/application/ports/in/student.finder.port.ts

export const STUDENT_FINDER_PORT = Symbol('STUDENT_FINDER_PORT');

export interface IStudentFinder {
  exists(id: number): Promise<boolean>;

  isActive(id: number): Promise<boolean>;

  getCareerIdByStudentId(studentId: number): Promise<number | null>;
}
