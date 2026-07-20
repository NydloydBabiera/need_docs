import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = process.env.FILE_UPLOAD_DIR!;

export async function saveFile(file: File) {
  await fs.mkdir(UPLOAD_DIR, {
    recursive: true,
  });

  const extension = path.extname(file.name);

  const filename = `${randomUUID()}${extension}`;

  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();

  await fs.writeFile(filepath, Buffer.from(bytes));

  return {
    filename,
    filepath,
  };
}
