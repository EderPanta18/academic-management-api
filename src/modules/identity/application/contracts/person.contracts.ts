export type PersonUniquenessCheckInput = {
  documentTypeId: string;
  documentNumber: string;
  email: string;
  phone?: string | null;
};
