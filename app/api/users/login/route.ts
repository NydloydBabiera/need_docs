import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
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
        const res = NextResponse.json({ success: true });

        // res.cookies.set("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "strict",
        //     path: "/documents",
        // });

        // return res;
        return NextResponse.json({
            status: 200,
            message: "Logged in successful",
            token,
            user
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