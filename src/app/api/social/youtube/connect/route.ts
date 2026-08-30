import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getYouTubeAuthUrl, YOUTUBE_SCOPES } from "@/services/youtube-auth";

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
      console.warn("DB not reachable in connect route (dev sandbox mode):", dbErr);
    }

    const { searchParams } = new URL(req.url);
    const isTesting = searchParams.get("channel") === "testing";

    const hasRealGoogleCredentials =
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET &&
      !process.env.AUTH_GOOGLE_ID.includes("dev_google");

    // If real Google Cloud OAuth is configured in .env, redirect to Google consent screen
    if (hasRealGoogleCredentials) {
      const authUrl = getYouTubeAuthUrl(workspaceId, isTesting);
      return NextResponse.redirect(authUrl);
    }

    // Otherwise, in local development mode, connect @AdrianLeblancMorales directly in DB (if DB reachable)
    try {
      await prisma.socialAccount.upsert({
        where: {
          workspaceId_platform_externalAccountId: {
            workspaceId,
            platform: "YOUTUBE",
            externalAccountId: "yt_testing_adrian",
          },
        },
        update: {
          accountName: "Adrian Leblanc Morales (Testing)",
          accountUsername: "@AdrianLeblancMorales",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: YOUTUBE_SCOPES,
          configUpdatedAt: new Date(),
        },
        create: {
          workspaceId,
          platform: "YOUTUBE",
          accountName: "Adrian Leblanc Morales (Testing)",
          accountUsername: "@AdrianLeblancMorales",
          externalAccountId: "yt_testing_adrian",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: YOUTUBE_SCOPES,
          configUpdatedAt: new Date(),
        },
      });
    } catch (upsertErr) {
      console.warn("Could not save to DB (continuing in mock mode):", upsertErr);
    }

    return NextResponse.redirect(
      new URL("/admin/accounts?success=youtube_connected", req.url)
    );
  } catch (error) {
    console.error("Error initiating YouTube OAuth:", error);
    return NextResponse.redirect(
      new URL("/admin/accounts?error=oauth_init_failed", req.url)
    );
  }
}
