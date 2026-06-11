import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const FILE_SERVER_API = process.env.FILE_SERVER_API;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get("file");
        console.log("🚀 ~ POST ~ file:", file)

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        // IMPORTANT: stream instead of re-buffering manually
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const controller = new AbortController();

        const response = await fetch(`${FILE_SERVER_API}/upload`, {
            method: "POST",
            body: uploadForm,
            signal: controller.signal,
        });
        console.log("🚀 ~ POST ~ response:", response)

        if (!response.ok) {
            return NextResponse.json(
                { message: "File server upload failed" },
                { status: 500 }
            );
        }

        const result = await response.json();

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("UPLOAD ERROR:", error);

        return NextResponse.json(
            { message: "Upload aborted or failed", error: error?.message },
            { status: 500 }
        );
    }
}
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json(
//         { message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const uploadDir = "/var/www/fileserver";

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const extension = path.extname(file.name);

//     const filename = `${uuidv4()}${extension}`;

//     fs.writeFileSync(
//       path.join(uploadDir, filename),
//       buffer
//     );

//     return NextResponse.json({
//       success: true,
//       filename,
//       originalName: file.name,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { message: "Upload failed" },
//       { status: 500 }
//     );
//   }
// }