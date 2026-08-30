import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Simulates Cloudflare R2 direct PUT upload in local dev
  return new NextResponse(null, { status: 200 });
}
