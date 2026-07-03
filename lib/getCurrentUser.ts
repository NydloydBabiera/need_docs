import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token) as { id: number } | null;
  console.log("🚀 ~ getCurrentUser ~ decoded:", decoded)
  if (!decoded) return null;

  return prisma.user_information.findUnique({
    where: { user_id: decoded.id },
  });
}