import Busboy from 'busboy';

export interface ParsedFile {
  filename: string;
  mimeType: string;
  buffer: Buffer;
}

export interface ParsedMultipart {
  fields: Record<string, string>;
  files: Record<string, ParsedFile>;
}

export function parseMultipart(req: Request): Promise<ParsedMultipart> {
  console.log('🚀 ~ parseMultipart ~ req.bodyUsed:', req.bodyUsed);
  console.log('Content-Type:', req.headers.get('content-type'));
  console.log('Content-Length:', req.headers.get('content-length'));
  console.log(
    "🚀 ~ parseMultipart ~ req.headers.get('content-type'):",
    req.headers.get('content-type')
  );
  return new Promise(async (resolve, reject) => {
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 1');
    const fields: Record<string, string> = {};
    const files: Record<string, ParsedFile> = {};
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 2');
    const bb = Busboy({
      headers: Object.fromEntries(req.headers.entries()),
    });
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 3');
    bb.on('field', (name, value) => {
      console.log('FIELD', name);
      fields[name] = value;
    });
    console.log('🚀 ~ parseMultipart ~ fields:', fields);
    console.log('🚀 ~ parseMultipart ~ files:', files);
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 4');
    bb.on('file', (name, file, info) => {
      console.log('FILE', name);
      const chunks: Buffer[] = [];
      console.log('🚀 ~ parseMultipart ~ parseMultipart: 5');
      file.on('data', (chunk) => {
        chunks.push(chunk);
      });
      console.log('🚀 ~ parseMultipart ~ parseMultipart: 6');
      file.on('end', () => {
        files[name] = {
          filename: info.filename,
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
      console.log('🚀 ~ parseMultipart ~ parseMultipart: 7');
      file.on('error', reject);
    });
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 8');
    bb.on('error', reject);
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 9');
    bb.on('finish', () => {
      console.log('FINISH');
      console.log('🚀 ~ parseMultipart ~ fields:', fields);
      console.log('🚀 ~ parseMultipart ~ files:', files);
      resolve({
        fields,
        files,
      });
    });
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 10');

    console.log('🚀 ~ parseMultipart ~ req.bodyUsed:', req.bodyUsed);
    try {
      console.log('Reading body...');

      const buffer = await req.arrayBuffer();

      console.log('Read complete', buffer.byteLength);

      bb.end(Buffer.from(buffer));
    } catch (err) {
      console.error('arrayBuffer failed');
      console.error(err);
    }
    // req
    //   .arrayBuffer()
    //   .then((buffer) => {
    //     const body = Buffer.from(buffer);
    //     console.log('got body', body.length);
    //     console.log('writing', body.length);

    //     bb.write(body);

    //     console.log('ending');

    //     bb.end();
    //   })
    //   .catch(reject);
    console.log('🚀 ~ parseMultipart ~ parseMultipart: 11');
  });
}
