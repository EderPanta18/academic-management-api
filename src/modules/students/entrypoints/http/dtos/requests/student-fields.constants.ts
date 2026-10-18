export const STUDENT_FIELDS = {
  documentNumber: {
    maxLength: 50,
    pattern: /^[A-Z0-9-]+$/,
  },
  firstName: {
    maxLength: 100,
  },
  lastName: {
    maxLength: 100,
  },
  email: {
    maxLength: 255,
  },
  phone: {
    maxLength: 30,
    pattern: /^[0-9]{9}$/,
  },
  code: {
    maxLength: 50,
    pattern: /^[A-Z0-9-]+$/,
  },
  institutionalEmail: {
    maxLength: 255,
  },
  admissionPeriod: {
    maxLength: 50,
  },
} as const;
