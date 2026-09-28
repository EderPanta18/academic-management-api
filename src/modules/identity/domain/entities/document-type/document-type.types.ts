export type DocumentTypeProps = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type CreateDocumentTypeProps = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};
