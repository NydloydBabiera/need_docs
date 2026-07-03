"use server"

import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const middleName = formData.get("middleName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;


        await prisma.user_information.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                middle_name: middleName,
                email,
                password,
                folder_location: `/${firstName}_${lastName}`
            },
        });

        return {
            message: "Registered successfully"
        }
    } catch (error) {
        return error
    }

}