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
    return new Promise((resolve, reject) => {
        const fields: Record<string, string> = {};
        const files: Record<string, ParsedFile> = {};

        const bb = Busboy({
            headers: Object.fromEntries(req.headers.entries()),
        });

        bb.on("field", (name, value) => {
            console.log("FIELD", name);
            fields[name] = value;
        });

        bb.on("file", (name, file, info) => {
            console.log("FILE", name);
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

            file.on("error", reject);
        });

        bb.on("error", reject);

        bb.on("finish", () => {
            console.log("FINISH");
            resolve({
                fields,
                files,
            });
        });

        req.arrayBuffer()
            .then((buffer) => {
                const body = Buffer.from(buffer);
                console.log("got body", body.length);
                bb.end(body);
            })
            .catch(reject);
    });
}