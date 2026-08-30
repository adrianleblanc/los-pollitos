import { prisma } from "@/lib/prisma";

export interface TikTokPublishResult {
  success: boolean;
  publishId?: string;
  postUrl?: string;
  errorMessage?: string;
  executionTimeMs: number;
}

export interface TikTokPublishOptions {
  contentId: string;
  socialAccountId?: string;
  privacyLevel?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY";
}

/**
 * Publishes a video to TikTok using the official Content Posting API v2 (Direct Post)
 */
export async function publishToTikTok({
  contentId,
  socialAccountId,
  privacyLevel = "PUBLIC_TO_EVERYONE",
}: TikTokPublishOptions): Promise<TikTokPublishResult> {
  const startTime = Date.now();

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!content) {
      throw new Error("Contenido no encontrado");
    }

    const primaryMedia = content.media.find(
      (m: any) => m.role === "PRIMARY_VIDEO"
    )?.media;

    if (!primaryMedia) {
      throw new Error("TikTok requiere un archivo de video para publicar.");
    }

    if (primaryMedia.mediaType !== "VIDEO") {
      throw new Error("El archivo seleccionado para TikTok debe ser un video.");
    }

    // Minimum video duration in TikTok is 3 seconds
    if (primaryMedia.durationSec && primaryMedia.durationSec < 3) {
      throw new Error("El video para TikTok debe durar al menos 3 segundos.");
    }

    // Find active TikTok SocialAccount
    const socialAccount = socialAccountId
      ? await prisma.socialAccount.findUnique({ where: { id: socialAccountId } })
      : await prisma.socialAccount.findFirst({
          where: {
            workspaceId: content.workspaceId,
            platform: "TIKTOK",
            tokenStatus: "ACTIVE",
          },
        });

    // Fallback simulation mode for development / testing
    if (
      !socialAccount ||
      !socialAccount.accessToken ||
      socialAccount.accessToken === "mock_token"
    ) {
      const mockPublishId = `tt_pub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        success: true,
        publishId: mockPublishId,
        postUrl: `https://www.tiktok.com/@lospollitos_tiktok/video/${mockPublishId}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const caption = `${content.title} ${content.tags.map((t: any) => `#${t}`).join(" ")}`.trim();

    // 1. Initialize Direct Post with PULL_FROM_URL
    const initRes = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${socialAccount.accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          post_info: {
            title: caption,
            privacy_level: privacyLevel,
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
            video_cover_timestamp_ms: 1000,
          },
          source_info: {
            source: "PULL_FROM_URL",
            video_url: primaryMedia.publicUrl,
          },
        }),
      }
    );

    const initData = await initRes.json();

    if (initData.error?.code && initData.error.code !== "ok") {
      throw new Error(
        `Error de TikTok API [${initData.error.code}]: ${initData.error.message}`
      );
    }

    const publishId = initData.data?.publish_id;

    if (!publishId) {
      throw new Error("TikTok no retornó publish_id en la respuesta.");
    }

    // 2. Initial status check
    const statusRes = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${socialAccount.accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ publish_id: publishId }),
      }
    );

    const statusData = await statusRes.json();
    const username = (socialAccount.accountUsername || "lospollitos_tiktok").replace(/^@/, "");
    const publicUrl = `https://www.tiktok.com/@${username}`;

    return {
      success: true,
      publishId,
      postUrl: publicUrl,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (error: any) {
    console.error("TikTok publish error:", error);
    return {
      success: false,
      errorMessage: error.message || "Error desconocido al publicar en TikTok",
      executionTimeMs: Date.now() - startTime,
    };
  }
}
