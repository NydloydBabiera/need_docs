import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useAuthStore } from "./lib/stores/useAuthStore";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    console.log("🚀 ~ middleware ~ token:", token)

    const { pathname } = request.nextUrl;

    const isAuthPage = pathname === "/";
    const isProtectedRoute =
        pathname.startsWith("/documents") 

    if (isProtectedRoute && !token) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    if (isAuthPage && token) {
        const url = request.nextUrl.clone();
        url.pathname = "/documents";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Apply middleware only where needed
export const config = {
    matcher: ["/", "/documents/:path*", "/documents"],
};