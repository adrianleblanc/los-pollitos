import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTikTokAuthUrl, TIKTOK_SCOPES } from "@/services/tiktok-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    let workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

    try {
      if (!session?.user?.currentWorkspaceId) {
        const defaultWorkspace = await prisma.workspace.findFirst();
        if (defaultWorkspace) workspaceId = defaultWorkspace.id;
      }
    } catch (dbErr) {
      console.warn("DB offline in tiktok connect:", dbErr);
    }

    const hasRealTikTokCredentials =
      process.env.TIKTOK_CLIENT_KEY &&
      !process.env.TIKTOK_CLIENT_KEY.includes("dev_");

    if (hasRealTikTokCredentials) {
      const authUrl = getTikTokAuthUrl(workspaceId);
      return NextResponse.redirect(authUrl);
    }

    // Local dev sandbox connection
    try {
      await prisma.socialAccount.upsert({
        where: {
          workspaceId_platform_externalAccountId: {
            workspaceId,
            platform: "TIKTOK",
            externalAccountId: "tt_pollitos_testing",
          },
        },
        update: {
          accountName: "Los Pollitos TikTok",
          accountUsername: "@lospollitos_tiktok",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: TIKTOK_SCOPES,
          configUpdatedAt: new Date(),
        },
        create: {
          workspaceId,
          platform: "TIKTOK",
          accountName: "Los Pollitos TikTok",
          accountUsername: "@lospollitos_tiktok",
          externalAccountId: "tt_pollitos_testing",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: TIKTOK_SCOPES,
          configUpdatedAt: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("DB offline in tiktok connect upsert:", dbErr);
    }

    return NextResponse.redirect(
      new URL("/admin/accounts?success=tiktok_connected", req.url)
    );
  } catch (error) {
    console.error("Error initiating TikTok OAuth:", error);
    return NextResponse.redirect(
      new URL("/admin/accounts?error=tiktok_oauth_failed", req.url)
    );
  }
}
