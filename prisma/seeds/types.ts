// prisma/seeds/types.ts

export interface BaseMaps {
  departmentMap: Map<string, number>;
  periodMap: Map<string, number>;
  categoryMap: Map<string, number>;
  personMap: Map<string, number>;
}

export interface AcademicMaps extends BaseMaps {
  careerMap: Map<string, number>;
  professorMap: Map<string, number>;
  studentMap: Map<string, number>;
  courseMap: Map<string, number>;
  offeringMap: Map<string, number>;
}
