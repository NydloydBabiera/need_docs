import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';
import axios from 'axios';
import { parseMultipart } from '@/lib/parseMultipart';
import { saveFile } from '@/lib/upload';
const FILE_SERVER_API = process.env.FILE_SERVER_API;
export const runtime = 'nodejs';

interface UploadResponse {
  filePath: string;
  message: string;
}

export async function POST(req: Request) {
  console.log('START');

  req.signal.addEventListener('abort', () => {
    console.log('ABORT');
  });

  try {
    const body = await req.arrayBuffer();

    console.log('BODY', body.byteLength);

    return Response.json({
      ok: true,
      size: body.byteLength,
    });
  } catch (e) {
    console.error(e);

    return Response.json({ error: 'failed' }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getCurrentUser(req);

//     if (!user) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     console.log('🚀 ~ POST ~ req:', req);
//     req.signal.addEventListener('abort', () => {
//       console.log('Request was aborted');
//     });
//     const formData = await req.formData();
//     const title = formData.get('title')?.toString() ?? '';
//     const description = formData.get('description')?.toString() ?? '';

//     const file = formData.get('document') as File;

//     if (!file) {
//       return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
//     }

//     const uploaded = await saveFile(file);

//     const document = await prisma.document_information.create({
//       data: {
//         title,
//         description,
//         filePath: `${uploaded.filepath}/${uploaded.filename}`,
//         user_id: user.user_id,
//       },
//     });

//     return NextResponse.json(document);
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
//   }
// }
// async function uploadFileToServer(file: File, path: string): Promise<UploadResponse> {
//   const arrayBuffer = await file.arrayBuffer();
//   const uploadForm = new FormData();
//   uploadForm.append('file', new Blob([arrayBuffer]), file.name);
//   uploadForm.append('path', path);

//   const uploadResponse = await axios.post(`${FILE_SERVER_API}/upload`, uploadForm, {
//     headers: {
//       Connection: 'close',
//     },
//   });

//   if (uploadResponse.status !== 200) {
//     console.log('🚀 ~ uploadFileToServer ~ uploadResponse:', uploadResponse);
//     throw new Error(`File upload failed with status: ${uploadResponse}`);
//   }

//   const uploadResult = await uploadResponse.data;
//   return uploadResult;
// }

// export async function POST(req: Request) {
//   console.log('1');

//   const user = await getCurrentUser(req);

//   if (!user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }
//   try {
//     console.log('2');

//     const { fields, files } = await parseMultipart(req);
//     console.log('🚀 ~ POST ~ files:', files);
//     console.log('🚀 ~ POST ~ fields:', fields);

//     console.log('3');
//     const title = fields.title;
//     console.log('🚀 ~ POST ~ title:', title);
//     const description = fields.description;
//     console.log('🚀 ~ POST ~ description:', description);

//     const uploaded = files.document;
//     console.log('🚀 ~ POST ~ uploaded:', uploaded);

//     if (!uploaded) {
//       return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
//     }
//     console.log('4');
//     const uint8 = new Uint8Array(uploaded.buffer);

//     const file = new File([uint8], uploaded.filename, {
//       type: uploaded.mimeType,
//     });

//     const uploadResult = await uploadFileToServer(file, user.folder_location);

//     const saved = await prisma.document_information.create({
//       data: {
//         title,
//         description,
//         filePath: uploadResult.filePath,
//         user_id: user.user_id,
//       },
//     });

//     return NextResponse.json({
//       message: 'Uploaded successfully',
//       data: saved,
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         message: 'Internal server error',
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
