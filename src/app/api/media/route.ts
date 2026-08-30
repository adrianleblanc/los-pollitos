import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createMediaSchema = z.object({
  name: z.string().min(1),
  mediaType: z.enum(["VIDEO", "IMAGE", "AUDIO", "DOCUMENT"]),
  mimeType: z.string().min(1),
  fileSize: z.number().positive(),
  r2Key: z.string().min(1),
  publicUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  durationSec: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  aspectRatio: z.string().optional().nullable(),
});

const mockMediaStore: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

    try {
      const mediaList = await prisma.media.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
      });

      const serialized = mediaList.map((m: any) => ({
        ...m,
        fileSize: m.fileSize.toString(),
      }));

      return NextResponse.json({ media: [...serialized, ...mockMediaStore] });
    } catch (dbErr) {
      console.warn("DB offline, returning in-memory media list:", dbErr);
      return NextResponse.json({ media: mockMediaStore });
    }
  } catch (error) {
    console.error("Error fetching media list:", error);
    return NextResponse.json({ media: mockMediaStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

    const body = await req.json();
    const validation = createMediaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    try {
      const newMedia = await prisma.media.create({
        data: {
          workspaceId,
          name: data.name,
          fileName: data.name,
          mediaType: data.mediaType,
          mimeType: data.mimeType,
          fileSize: BigInt(data.fileSize),
          r2Key: data.r2Key,
          publicUrl: data.publicUrl,
          thumbnailUrl: data.thumbnailUrl,
          durationSec: data.durationSec,
          width: data.width,
          height: data.height,
          aspectRatio: data.aspectRatio,
        },
      });

      return NextResponse.json({
        media: {
          ...newMedia,
          fileSize: newMedia.fileSize.toString(),
        },
      });
    } catch (dbErr) {
      console.warn("DB write failed, storing mock media:", dbErr);
      const mockSaved = {
        id: `mock_media_${Date.now()}`,
        workspaceId,
        name: data.name,
        fileName: data.name,
        mediaType: data.mediaType,
        mimeType: data.mimeType,
        fileSize: data.fileSize.toString(),
        r2Key: data.r2Key,
        publicUrl: data.publicUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        durationSec: data.durationSec || null,
        width: data.width || 1920,
        height: data.height || 1080,
        aspectRatio: data.aspectRatio || "16:9",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMediaStore.unshift(mockSaved);
      return NextResponse.json({ media: mockSaved });
    }
  } catch (error: any) {
    console.error("Error creating media record:", error);
    return NextResponse.json(
      { error: error.message || "Error al registrar el archivo multimedia" },
      { status: 500 }
    );
  }
}
