import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("🚀 ~ POST ~ body:", body)

        const hashedPassword = await bcrypt.hash(
            body.password,
            10
        );

        const user = await prisma.user_information.create({
            data: {
                first_name: body.first_name,
                middle_name: body.middle_name,
                last_name: body.last_name,
                email: body.email,
                password: hashedPassword,
                folder_location: `/${body.first_name}_${body.last_name}`
            },
        });
        console.log("🚀 ~ POST ~ user:", user)

        return NextResponse.json({
            user,
            status: 201,
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                error: error || "Failed to create user",
            },
            { status: 500 }
        );
    }
}
