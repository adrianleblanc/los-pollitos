import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateContentSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
  type: z.enum(["STANDARD_VIDEO", "SHORT_VIDEO", "POST_IMAGE", "CAROUSEL", "TEXT_ONLY"]).optional(),
  status: z.enum(["DRAFT", "READY", "SCHEDULED", "PUBLISHING", "PARTIALLY_PUBLISHED", "PUBLISHED", "FAILED"]).optional(),
  tags: z.array(z.string()).optional(),
  scheduledFor: z.string().datetime().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  customMetadata: z.record(z.string(), z.any()).optional().nullable(),
  mediaIds: z.array(
    z.object({
      mediaId: z.string(),
      role: z.enum(["PRIMARY_VIDEO", "THUMBNAIL", "CAROUSEL_ITEM", "ATTACHMENT"]),
      sortOrder: z.number().default(0),
    })
  ).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";
    const { id } = await params;

    let content: any = null;
    try {
      content = await prisma.content.findUnique({
        where: { id },
        include: {
          author: { select: { name: true, email: true, image: true } },
          media: {
            include: { media: true },
            orderBy: { sortOrder: "asc" },
          },
          categories: { include: { category: true } },
          publications: {
            include: {
              socialAccount: true,
              attempts: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn("DB offline in content GET:", dbErr);
    }

    if (!content) {
      return NextResponse.json({
        content: {
          id,
          title: "Publicación",
          description: "",
          type: "STANDARD_VIDEO",
          status: "DRAFT",
          tags: [],
          media: [],
          categories: [],
          publications: [],
        },
      });
    }

    return NextResponse.json({
      content: {
        ...content,
        media: content.media.map((cm: any) => ({
          ...cm,
          media: {
            ...cm.media,
            fileSize: cm.media.fileSize ? cm.media.fileSize.toString() : "0",
          },
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Error al obtener el contenido" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";
    const { id } = await params;
    const body = await req.json();
    const validation = updateContentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Update basic fields
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.scheduledFor !== undefined) {
      updateData.scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
    }
    if (data.publishedAt !== undefined) {
      updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    }
    if (data.customMetadata !== undefined) updateData.customMetadata = data.customMetadata;

    if (data.mediaIds) {
      try {
        await prisma.contentMedia.deleteMany({ where: { contentId: id } });
      } catch {}
      updateData.media = {
        create: data.mediaIds.map((m: any) => ({
          mediaId: m.mediaId,
          role: m.role,
          sortOrder: m.sortOrder,
        })),
      };
    }

    if (data.categoryIds) {
      try {
        await prisma.contentCategory.deleteMany({ where: { contentId: id } });
      } catch {}
      updateData.categories = {
        create: data.categoryIds.map((catId: any) => ({
          categoryId: catId,
        })),
      };
    }

    try {
      const updated = await prisma.content.update({
        where: { id },
        data: updateData,
        include: {
          media: { include: { media: true } },
          categories: { include: { category: true } },
        },
      });

      return NextResponse.json({
        content: {
          ...updated,
          media: updated.media.map((cm: any) => ({
            ...cm,
            media: {
              ...cm.media,
              fileSize: cm.media.fileSize ? cm.media.fileSize.toString() : "0",
            },
          })),
        },
      });
    } catch (dbErr) {
      console.warn("DB offline in update content:", dbErr);
      return NextResponse.json({
        content: {
          id,
          ...updateData,
          media: [],
          categories: [],
        },
      });
    }
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Error al actualizar el contenido" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.content.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("DB offline in delete content:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Error al eliminar el contenido" },
      { status: 500 }
    );
  }
}
