export const COURSE_OFFERING_FIELDS = {
  section: {
    minLength: 1,
    maxLength: 20,
    pattern: /^[A-Z0-9-]+$/,
  },
  maxCapacity: {
    min: 1,
    max: 500,
  },
  availableCapacity: {
    min: 0,
  },
} as const;
