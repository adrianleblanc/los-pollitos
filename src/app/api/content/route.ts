import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createContentSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().optional().nullable(),
  type: z.enum(["STANDARD_VIDEO", "SHORT_VIDEO", "POST_IMAGE", "CAROUSEL", "TEXT_ONLY"]).default("STANDARD_VIDEO"),
  status: z.enum(["DRAFT", "READY", "SCHEDULED", "PUBLISHING", "PUBLISHED", "FAILED"]).default("DRAFT"),
  tags: z.array(z.string()).default([]),
  scheduledFor: z.string().datetime().optional().nullable(),
  mediaIds: z.array(
    z.object({
      mediaId: z.string(),
      role: z.enum(["PRIMARY_VIDEO", "THUMBNAIL", "CAROUSEL_ITEM", "ATTACHMENT"]).default("PRIMARY_VIDEO"),
      sortOrder: z.number().default(0),
    })
  ).default([]),
  categoryIds: z.array(z.string()).default([]),
  targetPlatforms: z.array(z.enum(["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK"])).default([]),
  customMetadata: z.record(z.string(), z.any()).optional().nullable(),
});

// In-memory store for fallback development testing
const mockContentsStore: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("q");

    try {
      const whereClause: any = { workspaceId };

      if (status && status !== "ALL") whereClause.status = status;
      if (type && type !== "ALL") whereClause.type = type;
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const contents = await prisma.content.findMany({
        where: whereClause,
        include: {
          author: { select: { name: true, email: true, image: true } },
          media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
          categories: { include: { category: true } },
          publications: { include: { socialAccount: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      const serializedContents = contents.map((c: any) => ({
        ...c,
        media: c.media.map((cm: any) => ({
          ...cm,
          media: {
            ...cm.media,
            fileSize: cm.media.fileSize ? cm.media.fileSize.toString() : "0",
          },
        })),
      }));

      return NextResponse.json({ contents: [...serializedContents, ...mockContentsStore] });
    } catch (dbErr) {
      console.warn("DB offline, using in-memory store for content list:", dbErr);
      return NextResponse.json({ contents: mockContentsStore });
    }
  } catch (error) {
    console.error("Error fetching content list:", error);
    return NextResponse.json({ contents: mockContentsStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";
    const authorId = session?.user?.id || "dev_user_1";

    const body = await req.json();
    const validation = createContentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    try {
      // Ensure user and workspace exist in DB
      await prisma.workspace.upsert({
        where: { id: workspaceId },
        update: {},
        create: { id: workspaceId, name: "Los Pollitos", slug: "los-pollitos" },
      });

      await prisma.user.upsert({
        where: { id: authorId },
        update: {},
        create: { id: authorId, name: "Adrian Leblanc Morales", email: "adrian@lospollitos.com" },
      });

      const newContent = await prisma.content.create({
        data: {
          workspaceId,
          authorId,
          title: data.title,
          description: data.description ?? null,
          type: data.type,
          status: data.status,
          tags: data.tags,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
          customMetadata: data.customMetadata ?? undefined,
          media: {
            create: data.mediaIds.map((m: any) => ({
              mediaId: m.mediaId,
              role: m.role,
              sortOrder: m.sortOrder,
            })),
          },
        },
        include: {
          media: { include: { media: true } },
          categories: { include: { category: true } },
        },
      });

      return NextResponse.json({
        content: {
          ...newContent,
          media: newContent.media.map((cm: any) => ({
            ...cm,
            media: {
              ...cm.media,
              fileSize: cm.media.fileSize ? cm.media.fileSize.toString() : "0",
            },
          })),
        },
      });
    } catch (dbErr) {
      console.warn("DB write failed, storing mock content:", dbErr);
      const mockSaved = {
        id: `mock_content_${Date.now()}`,
        workspaceId,
        authorId,
        title: data.title,
        description: data.description || "",
        type: data.type,
        status: data.status,
        tags: data.tags,
        scheduledFor: data.scheduledFor || null,
        customMetadata: data.customMetadata || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        media: [],
        categories: [],
        publications: [],
      };
      mockContentsStore.unshift(mockSaved);
      return NextResponse.json({ content: mockSaved });
    }
  } catch (error: any) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear el contenido" },
      { status: 500 }
    );
  }
}
