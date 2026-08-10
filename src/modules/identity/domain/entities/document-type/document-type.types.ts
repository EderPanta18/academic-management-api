export interface DocumentTypeProps {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export interface CreateDocumentTypeProps {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}
