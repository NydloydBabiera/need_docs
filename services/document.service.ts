import { api } from "@/lib/api/api";

export interface DocumentPayload {
  title: string;
  description: string;
  document: File
}



export const uploadDocument = async (payload: DocumentPayload) => {
  const UPLOAD_ROUTE = process.env.NEXT_PUBLIC_UPLOAD_ROUTE;
  console.log("🚀 ~ UPLOAD_ROUTE:", UPLOAD_ROUTE)
  const uploadPath = UPLOAD_ROUTE?.toString() || "/api/documents/upload";
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);

  formData.append("document", payload.document);

  console.log({
    name: payload.document.name,
    size: payload.document.size,
    type: payload.document.type,
  });

  const response = await api.post(uploadPath, formData, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
      "Connection": "keep-alive"
    },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get("/api/documents");

  return response.data;
}