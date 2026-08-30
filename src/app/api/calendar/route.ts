import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId;

    const whereClause: any = {};
    if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    }

    let contents: any[] = [];
    try {
      contents = await prisma.content.findMany({
        where: whereClause,
        include: {
          media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
          publications: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB offline in calendar route:", dbErr);
    }

    const serializedContents = contents.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      type: c.type,
      status: c.status,
      tags: c.tags,
      scheduledFor: c.scheduledFor,
      publishedAt: c.publishedAt,
      createdAt: c.createdAt,
      primaryMedia: c.media?.find((m: any) => m.role === "PRIMARY_VIDEO")?.media?.publicUrl || null,
      customMetadata: c.customMetadata,
      publications: c.publications,
    }));

    return NextResponse.json({ contents: serializedContents });
  } catch (error: any) {
    console.error("Error in calendar route:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener eventos del calendario" },
      { status: 500 }
    );
  }
}
