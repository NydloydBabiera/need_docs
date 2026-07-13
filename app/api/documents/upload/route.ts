import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import axios from "axios";
import { parseMultipart } from "@/lib/parseMultipart";
const FILE_SERVER_API = process.env.FILE_SERVER_API;
export const runtime = "nodejs";

interface UploadResponse {
    filePath: string;
    message: string;
}

async function uploadFileToServer(file: File, path: string): Promise<UploadResponse> {
    const arrayBuffer = await file.arrayBuffer();
    const uploadForm = new FormData();
    uploadForm.append(
        "file",
        new Blob([arrayBuffer]),
        file.name
    );
    uploadForm.append("path", path);

    const uploadResponse = await axios.post(`${FILE_SERVER_API}/upload`, uploadForm, {
        headers: {
            Connection: "close",
        },
    });

    if (uploadResponse.status !== 200) {
        console.log("🚀 ~ uploadFileToServer ~ uploadResponse:", uploadResponse);
        throw new Error(`File upload failed with status: ${uploadResponse}`);
    }

    const uploadResult = await uploadResponse.data;
    return uploadResult;
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        
        console.log("🚀 ~ POST ~ req:", req)
        const { fields, files } = await parseMultipart(req);


        const title = fields.title;
        const description = fields.description;

        const uploaded = files.document;

        if (!uploaded) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        const uint8 = new Uint8Array(uploaded.buffer);

        const file = new File(
            [uint8],
            uploaded.filename,
            {
                type: uploaded.mimeType,
            }
        );

        const uploadResult = await uploadFileToServer(
            file,
            user.folder_location
        );

        const saved = await prisma.document_information.create({
            data: {
                title,
                description,
                filePath: uploadResult.filePath,
                user_id: user.user_id,
            },
        });

        return NextResponse.json({
            message: "Uploaded successfully",
            data: saved,
        });

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}
