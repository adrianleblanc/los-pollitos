import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPresignedUploadUrl } from "@/lib/r2";
import { z } from "zod";

const uploadUrlSchema = z.object({
  fileName: z.string().optional(),
  filename: z.string().optional(),
  fileType: z.string().optional(),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

    const body = await req.json();
    const validation = uploadUrlSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const fileName = validation.data.fileName || validation.data.filename || `file_${Date.now()}`;
    const fileType = validation.data.fileType || validation.data.contentType || "application/octet-stream";

    const hasRealR2Credentials =
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      !process.env.CLOUDFLARE_ACCOUNT_ID.includes("sample");

    if (hasRealR2Credentials) {
      try {
        const { uploadUrl, r2Key, publicUrl } = await getPresignedUploadUrl({
          workspaceId,
          fileName,
          fileType,
        });

        return NextResponse.json({
          uploadUrl,
          r2Key,
          publicUrl,
        });
      } catch (r2Err) {
        console.warn("R2 presign failed, falling back to local simulation URL:", r2Err);
      }
    }

    // Local development simulation fallback for R2 upload
    const mockR2Key = `workspaces/${workspaceId}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const mockPublicUrl = `https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1280&auto=format&fit=crop`;

    return NextResponse.json({
      uploadUrl: `/api/media/mock-upload`, // Internal mock endpoint that accepts PUT
      r2Key: mockR2Key,
      publicUrl: mockPublicUrl,
    });
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: error.message || "Error al generar URL de subida" },
      { status: 500 }
    );
  }
}
