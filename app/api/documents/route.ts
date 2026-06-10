import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
const FILE_SERVER = process.env.FILE_SERVER_URL;
export async function GET() {
    try {
        const documents: any[] = []
        const response = await fetch(
            `${FILE_SERVER}/documents/`
        );

        const html = await response.text();

        const matches = [
            ...html.matchAll(/href="([^"]+\.(pdf|jpg|png))"/gi),
        ];

        matches.forEach((match) => {
            const fileName = match[1];

            documents.push({
                fileName: fileName,
                url: `${FILE_SERVER}/documents/${fileName}`,
            });
        });
        // console.log("🚀 ~ GET ~ documents:", documents)
        return NextResponse.json(documents);
    } catch (error) {
        console.error(error);
    }
    //   try {
    //     const uploadDir = "/var/www/fileserver";

    //     if (!fs.existsSync(uploadDir)) {
    //       return NextResponse.json([]);
    //     }

    //     const files = fs.readdirSync(uploadDir);

    //     const docs = files.map((file) => {
    //       const stats = fs.statSync(
    //         path.join(uploadDir, file)
    //       );

    //       return {
    //         filename: file,
    //         size: stats.size,
    //         createdAt: stats.birthtime,
    //         url: `/files/${file}`,
    //       };
    //     });

    //     return NextResponse.json(docs);
    //   } catch (error) {
    //     console.error(error);

    //     return NextResponse.json(
    //       { message: "Failed to fetch documents" },
    //       { status: 500 }
    //     );
    //   }
}