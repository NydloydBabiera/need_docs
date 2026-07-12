import Busboy from "busboy";

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
    return new Promise(async (resolve, reject) => {
        const fields: Record<string, string> = {};
        const files: Record<string, ParsedFile> = {};

        const bb = Busboy({
            headers: Object.fromEntries(req.headers.entries()),
        });

        bb.on("field", (name, value) => {
            fields[name] = value;
        });

        bb.on("file", (name, file, info) => {
            const chunks: Buffer[] = [];

            file.on("data", (chunk) => {
                chunks.push(chunk);
            });

            file.on("end", () => {
                files[name] = {
                    filename: info.filename,
                    mimeType: info.mimeType,
                    buffer: Buffer.concat(chunks),
                };
            });
        });

        bb.on("error", reject);

        bb.on("finish", () => {
            resolve({
                fields,
                files,
            });
        });

        const body = Buffer.from(await req.arrayBuffer());

        bb.end(body);
    });
}