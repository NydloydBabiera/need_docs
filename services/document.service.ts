import { api } from "@/lib/api/api";

export interface DocumentPayload {
  title: string;
  description: string;
  document: File
}

export const uploadDocument = async (payload: DocumentPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);

  formData.append("document", payload.document);

  console.log({
    name: payload.document.name,
    size: payload.document.size,
    type: payload.document.type,
  });

  const response = await api.post("/api/documents/upload", formData, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get("/api/documents");

  return response.data;
}