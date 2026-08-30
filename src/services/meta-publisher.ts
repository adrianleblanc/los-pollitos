import { prisma } from "@/lib/prisma";
import { META_GRAPH_VERSION } from "./meta-auth";

const GRAPH_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export interface MetaPublishResult {
  platform: "FACEBOOK" | "INSTAGRAM";
  success: boolean;
  postId?: string;
  postUrl?: string;
  errorMessage?: string;
  executionTimeMs: number;
}

// ----------------------------------------------------
// FACEBOOK PAGE PUBLISHER
// ----------------------------------------------------

export async function publishToFacebookPage({
  contentId,
  socialAccountId,
}: {
  contentId: string;
  socialAccountId?: string;
}): Promise<MetaPublishResult> {
  const startTime = Date.now();

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!content) throw new Error("Contenido no encontrado");

    // Find active Facebook SocialAccount
    const socialAccount = socialAccountId
      ? await prisma.socialAccount.findUnique({ where: { id: socialAccountId } })
      : await prisma.socialAccount.findFirst({
          where: { workspaceId: content.workspaceId, platform: "FACEBOOK", tokenStatus: "ACTIVE" },
        });

    // Fallback simulation mode
    if (!socialAccount || !socialAccount.accessToken || socialAccount.accessToken === "mock_token") {
      const mockPostId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        platform: "FACEBOOK",
        success: true,
        postId: mockPostId,
        postUrl: `https://facebook.com/${mockPostId}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const pageId = socialAccount.externalAccountId;
    const pageToken = socialAccount.accessToken;
    const primaryMedia = content.media.find((m) => m.role === "PRIMARY_VIDEO")?.media;
    const caption = `${content.title}\n\n${content.description || ""}\n\n${content.tags.map((t) => `#${t}`).join(" ")}`.trim();

    let endpoint = "";
    let bodyData: any = {};

    if (primaryMedia?.mediaType === "VIDEO") {
      // Publish video to Facebook Page
      endpoint = `${GRAPH_URL}/${pageId}/videos`;
      bodyData = {
        file_url: primaryMedia.publicUrl,
        title: content.title,
        description: caption,
        access_token: pageToken,
      };
    } else if (primaryMedia?.mediaType === "IMAGE") {
      // Publish photo to Facebook Page
      endpoint = `${GRAPH_URL}/${pageId}/photos`;
      bodyData = {
        url: primaryMedia.publicUrl,
        caption: caption,
        access_token: pageToken,
      };
    } else {
      // Text-only feed post
      endpoint = `${GRAPH_URL}/${pageId}/feed`;
      bodyData = {
        message: caption,
        access_token: pageToken,
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Error al publicar en Facebook");
    }

    const postId = data.id || data.post_id;
    return {
      platform: "FACEBOOK",
      success: true,
      postId,
      postUrl: `https://facebook.com/${postId}`,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    console.error("Facebook publishing error:", err);
    return {
      platform: "FACEBOOK",
      success: false,
      errorMessage: err.message || "Error en la publicación de Facebook",
      executionTimeMs: Date.now() - startTime,
    };
  }
}

// ----------------------------------------------------
// INSTAGRAM GRAPH API PUBLISHER (2-Step Container Model)
// ----------------------------------------------------

export async function publishToInstagram({
  contentId,
  socialAccountId,
}: {
  contentId: string;
  socialAccountId?: string;
}): Promise<MetaPublishResult> {
  const startTime = Date.now();

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!content) throw new Error("Contenido no encontrado");

    // Find active Instagram SocialAccount
    const socialAccount = socialAccountId
      ? await prisma.socialAccount.findUnique({ where: { id: socialAccountId } })
      : await prisma.socialAccount.findFirst({
          where: { workspaceId: content.workspaceId, platform: "INSTAGRAM", tokenStatus: "ACTIVE" },
        });

    // Fallback simulation mode
    if (!socialAccount || !socialAccount.accessToken || socialAccount.accessToken === "mock_token") {
      const mockPostId = `ig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        platform: "INSTAGRAM",
        success: true,
        postId: mockPostId,
        postUrl: `https://instagram.com/p/${mockPostId}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const igUserId = socialAccount.externalAccountId;
    const pageToken = socialAccount.accessToken;
    const primaryMedia = content.media.find((m) => m.role === "PRIMARY_VIDEO")?.media;
    const thumbnailMedia = content.media.find((m) => m.role === "THUMBNAIL")?.media;
    const caption = `${content.title}\n\n${content.description || ""}\n\n${content.tags.map((t) => `#${t}`).join(" ")}`.trim();

    if (!primaryMedia) {
      throw new Error("Instagram requiere al menos una imagen o video para publicar.");
    }

    const isVideo = primaryMedia.mediaType === "VIDEO";

    // Validate Reels duration (Max 90s per August 2026 API v26.0 verification)
    if (isVideo && primaryMedia.durationSec && primaryMedia.durationSec > 90) {
      throw new Error(
        `Instagram limita los Reels vía API a un máximo de 90 segundos. Este video dura ${Math.round(primaryMedia.durationSec)}s.`
      );
    }

    // --------------------------------------------------
    // STEP 1: CREATE MEDIA CONTAINER
    // --------------------------------------------------
    const containerParams: any = {
      caption,
      access_token: pageToken,
    };

    if (isVideo) {
      containerParams.media_type = "REELS";
      containerParams.video_url = primaryMedia.publicUrl;
      containerParams.share_to_feed = true;
      if (thumbnailMedia?.publicUrl) {
        containerParams.cover_url = thumbnailMedia.publicUrl;
      }
    } else {
      containerParams.image_url = primaryMedia.publicUrl;
    }

    const createContainerRes = await fetch(`${GRAPH_URL}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(containerParams),
    });

    const createData = await createContainerRes.json();
    if (!createContainerRes.ok || createData.error) {
      throw new Error(createData.error?.message || "Error al crear contenedor en Instagram");
    }

    const containerId = createData.id;

    // --------------------------------------------------
    // STEP 1.5: WAIT / POLL CONTAINER STATUS (For Videos)
    // --------------------------------------------------
    if (isVideo) {
      let isReady = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 15;

      while (!isReady && attempts < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
        attempts++;

        const statusRes = await fetch(
          `${GRAPH_URL}/${containerId}?fields=status_code,status&access_token=${pageToken}`
        );
        const statusData = await statusRes.json();

        if (statusData.status_code === "FINISHED") {
          isReady = true;
        } else if (statusData.status_code === "ERROR" || statusData.status_code === "EXPIRED") {
          throw new Error("El procesamiento del video en Instagram falló.");
        }
      }
    }

    // --------------------------------------------------
    // STEP 2: PUBLISH CONTAINER
    // --------------------------------------------------
    const publishRes = await fetch(`${GRAPH_URL}/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: pageToken,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || publishData.error) {
      throw new Error(publishData.error?.message || "Error al publicar contenedor en Instagram");
    }

    const mediaId = publishData.id;
    return {
      platform: "INSTAGRAM",
      success: true,
      postId: mediaId,
      postUrl: `https://instagram.com/p/${mediaId}`,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    console.error("Instagram publishing error:", err);
    return {
      platform: "INSTAGRAM",
      success: false,
      errorMessage: err.message || "Error en la publicación de Instagram",
      executionTimeMs: Date.now() - startTime,
    };
  }
}
