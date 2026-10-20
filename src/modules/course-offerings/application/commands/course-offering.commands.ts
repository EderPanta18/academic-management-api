export type CreateCourseOfferingCommand = {
  courseId: string;
  academicPeriodId: string;
  professorId: string | null;
  section: string;
  maxCapacity: number;
  availableCapacity: number | null;
};

export type AssignProfessorToOfferingCommand = {
  offeringId: string;
  professorId: string;
};
