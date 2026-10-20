import { StudentStatus } from './student.enums';

export const STUDENT = {
  defaults: {
    status: StudentStatus.ACTIVE,
  },
} as const;
