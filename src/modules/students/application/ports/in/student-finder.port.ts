// modules/students/application/ports/in/student.finder.port.ts

export const STUDENT_FINDER_TOKEN = Symbol('STUDENT_FINDER');

export interface IStudentFinder {
  getAcademicProgramId(id: string): Promise<string | null>;
}
