export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("START");

    try {
        const body = await req.arrayBuffer();

        console.log("BODY LENGTH", body.byteLength);

        return Response.json({ ok: true });
    } catch (err) {
        console.error(err);
        return Response.json({ ok: false }, { status: 500 });
    }
}