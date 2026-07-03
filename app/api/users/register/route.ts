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
                first_name: body.firstName,
                middle_name: body.middleName,
                last_name: body.lastName,
                email: body.email,
                password: hashedPassword,
                folder_location: `/${body.firstName}_${body.lastName}`
            },
        });
        console.log("🚀 ~ POST ~ user:", user)

        return NextResponse.json({
            user,
            status: 201,
            message: "Registration successful",
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to create user",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;
        const user = await prisma.user_information.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({
                status: 401,
                message: "No user found",
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 10);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({
                status: 401,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user.user_id,
                email: user.email,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d",
            },
        );

        return NextResponse.json({
            status: 200,
            message: "Logged in successful",
            token,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to create user",
            },
            { status: 500 }
        );
    }
}