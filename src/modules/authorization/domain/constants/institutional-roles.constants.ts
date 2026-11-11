// src/modules/authorization/domain/constants/institutional-roles.constants.ts

export const INSTITUTIONAL_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SECRETARY: 'SECRETARY',
  ACADEMIC_COORDINATOR: 'ACADEMIC_COORDINATOR',
  REPORT_VIEWER: 'REPORT_VIEWER',
} as const;

export const ADMINISTRATIVE_ROLES: ReadonlySet<string> = new Set([
  INSTITUTIONAL_ROLES.SUPER_ADMIN,
  INSTITUTIONAL_ROLES.ADMIN,
]);
