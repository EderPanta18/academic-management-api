export type StartStudentImportCommand = {
  fileName: string;
  fileExtension: string;
  fileSize: number;
  fileMimeType: string;
  fileContent: Buffer;
  createdByUserId: string;
};

export type ProcessStudentImportCommand = {
  importId: string;
};
