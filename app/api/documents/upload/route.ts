import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
const FILE_SERVER_API = process.env.FILE_SERVER_API;

async function uploadFileToServer(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const uploadForm = new FormData();
    uploadForm.append(
        "file",
        new Blob([arrayBuffer]),
        file.name
    );
    uploadForm.append("path", "documents/contracts");

    const uploadResponse = await fetch(`${FILE_SERVER_API}/upload`, {
        method: "POST",
        body: uploadForm,
        headers: {
            Connection: "close",
        },
    });

    if (!uploadResponse.ok) {
        throw new Error("File upload failed");
    }

    const uploadResult = await uploadResponse.json();
    return uploadResult.url;
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        console.log("🚀 1")
        const formData = await req.formData();

        console.log("🚀 2")
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.log({
            method: req.method,
            contentType: req.headers.get("content-type"),
            contentLength: req.headers.get("content-length"),
        });


        console.log("🚀 3")
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("document") as File;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }
        console.log("🚀 4")
        // ✅ Upload file FIRST (no DB yet)
        console.log("✅ Upload file FIRST (no DB yet)")
        const arrayBuffer = await file.arrayBuffer();

        const uploadForm = new FormData();
        uploadForm.append(
            "file",
            new Blob([arrayBuffer]),
            file.name
        );
        uploadForm.append("path", "documents/contracts");

        console.log("🚀 5")
        const uploadResponse = await fetch(`${FILE_SERVER_API}/upload`, {
            method: "POST",
            body: uploadForm,
            headers: {
                Connection: "close",
            },
        });
        console.log("🚀 ~ POST ~ uploadResponse:", uploadResponse)

        if (!uploadResponse.ok) {
            return NextResponse.json(
                { message: "File upload failed" },
                { status: 500 }
            );
        }

        console.log("🚀 6")
        const uploadResult = await uploadResponse.json();

        // ✅ Now save DB using REAL file path
        const saved = await prisma.document_information.create({
            data: {
                title,
                description,
                filePath: uploadResult.url, // 👈 correct
                user_id: user.user_id,
            }
        });

        return NextResponse.json({
            message: "Uploaded successfully",
            data: saved,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
