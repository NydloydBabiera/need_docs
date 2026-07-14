import { api } from '@/lib/api/api';
import Cookies from 'js-cookie';
export interface DocumentPayload {
  title: string;
  description: string;
  document: File;
}

export const uploadDocument = async (payload: DocumentPayload) => {
  const UPLOAD_ROUTE = process.env.NEXT_PUBLIC_UPLOAD_ROUTE;
  const uploadPath = UPLOAD_ROUTE?.toString() || '/api/documents/upload';

  let formData = null;
  try {
    formData = new FormData();
  } catch (error) {
    console.error('Error creating FormData:', error);
  }
  console.log('🚀 ~ uploadDocument ~ formData:', formData);

  formData?.append('title', payload.title);
  formData?.append('description', payload.description);

  formData?.append('document', payload.document);

  console.log({
    name: payload.document.name,
    size: payload.document.size,
    type: payload.document.type,
  });
  const token = Cookies.get('token');
  const response = await fetch(uploadPath, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // however you're currently sending it
    },
    body: formData,
  });

  // const response = await api.post(uploadPath, formData, {
  //   maxBodyLength: Infinity,
  //   maxContentLength: Infinity,
  // });
  const text = await response.text();
  console.log(text);
  return text;
};

export const getDocuments = async () => {
  const response = await api.get('/api/documents');

  return response.data;
};
