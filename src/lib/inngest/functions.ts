import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { publishVideoToYouTube } from "@/services/youtube-publisher";
import { publishToFacebookPage, publishToInstagram } from "@/services/meta-publisher";
import { publishToTikTok } from "@/services/tiktok-publisher";

/**
 * 1. Function: Orchestrates Scheduled & Event-driven Multi-Platform Publishing (YouTube, Meta, TikTok)
 */
export const publishScheduledPost = inngest.createFunction(
  {
    id: "publish-scheduled-post",
    name: "Publicar Contenido Programado Multi-Red",
    triggers: [{ event: "content/publish.requested" }],
  },
  async ({ event, step }: any) => {
    const data = event.data as {
      contentId: string;
      targetPlatforms?: string[];
      scheduledDate?: string;
    };

    const { contentId, targetPlatforms } = data;

    // Step 1: Fetch Content and verify eligibility
    const content = await step.run("fetch-content", async () => {
      const item = await prisma.content.findUnique({
        where: { id: contentId },
        include: {
          media: { include: { media: true } },
          workspace: true,
        },
      });

      if (!item) {
        throw new Error(`Contenido con ID ${contentId} no existe.`);
      }

      await prisma.content.update({
        where: { id: contentId },
        data: { status: "PUBLISHING" },
      });

      return {
        id: item.id,
        title: item.title,
        workspaceId: item.workspaceId,
      };
    });

    const platforms = targetPlatforms || ["YOUTUBE", "INSTAGRAM", "FACEBOOK", "TIKTOK"];
    const results: Record<string, any> = {};

    // Step 2: Publish to YouTube (if requested)
    if (platforms.includes("YOUTUBE")) {
      results.youtube = await step.run("publish-to-youtube", async () => {
        return await publishVideoToYouTube({ contentId: content.id });
      });
    }

    // Step 3: Publish to Facebook (if requested)
    if (platforms.includes("FACEBOOK")) {
      results.facebook = await step.run("publish-to-facebook", async () => {
        return await publishToFacebookPage({ contentId: content.id });
      });
    }

    // Step 4: Publish to Instagram (if requested)
    if (platforms.includes("INSTAGRAM")) {
      results.instagram = await step.run("publish-to-instagram", async () => {
        return await publishToInstagram({ contentId: content.id });
      });
    }

    // Step 5: Publish to TikTok (if requested)
    if (platforms.includes("TIKTOK")) {
      results.tiktok = await step.run("publish-to-tiktok", async () => {
        return await publishToTikTok({ contentId: content.id });
      });
    }

    // Step 6: Final status consolidation
    await step.run("finalize-publication-status", async () => {
      const anySuccess =
        results.youtube?.success ||
        results.facebook?.success ||
        results.instagram?.success ||
        results.tiktok?.success;

      await prisma.content.update({
        where: { id: content.id },
        data: {
          status: anySuccess ? "PUBLISHED" : "FAILED",
          publishedAt: anySuccess ? new Date() : null,
        },
      });
    });

    return { contentId: content.id, results };
  }
);

/**
 * 2. Function: Periodic Cron (Every 5 minutes) to discover due scheduled posts
 */
export const checkScheduledPostsCron = inngest.createFunction(
  {
    id: "check-scheduled-posts-cron",
    name: "Cron de Búsqueda de Publicaciones Programadas",
    triggers: [{ cron: "*/5 * * * *" }],
  },
  async ({ step }: any) => {
    const duePosts = await step.run("find-due-posts", async () => {
      const now = new Date();
      const posts = await prisma.content.findMany({
        where: {
          status: "SCHEDULED",
          scheduledFor: {
            lte: now,
          },
        },
        select: {
          id: true,
          title: true,
          scheduledFor: true,
          workspaceId: true,
        },
        take: 20,
      });
      return posts;
    });

    if (duePosts.length === 0) {
      return { message: "No hay publicaciones programadas pendientes." };
    }

    const events = duePosts.map((post: any) => ({
      name: "content/publish.requested",
      data: {
        contentId: post.id,
        scheduledDate: post.scheduledFor,
        targetPlatforms: ["YOUTUBE", "INSTAGRAM", "FACEBOOK", "TIKTOK"],
      },
    }));

    await inngest.send(events);

    return {
      triggeredCount: duePosts.length,
      posts: duePosts.map((p: any) => p.title),
    };
  }
);

export const inngestFunctions = [publishScheduledPost, checkScheduledPostsCron];
