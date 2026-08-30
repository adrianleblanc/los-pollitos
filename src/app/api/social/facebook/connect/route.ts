import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMetaAuthUrl, META_SCOPES } from "@/services/meta-auth";

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
      console.warn("DB offline in facebook connect:", dbErr);
    }

    const hasRealMetaCredentials =
      (process.env.META_APP_ID || process.env.AUTH_FACEBOOK_ID) &&
      !process.env.META_APP_ID?.includes("dev_");

    if (hasRealMetaCredentials) {
      const authUrl = getMetaAuthUrl(workspaceId);
      return NextResponse.redirect(authUrl);
    }

    // Local dev sandbox connection
    try {
      await prisma.socialAccount.upsert({
        where: {
          workspaceId_platform_externalAccountId: {
            workspaceId,
            platform: "FACEBOOK",
            externalAccountId: "fb_page_pollitos_testing",
          },
        },
        update: {
          accountName: "Los Pollitos Fanpage",
          accountUsername: "Los Pollitos Fanpage",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
        create: {
          workspaceId,
          platform: "FACEBOOK",
          accountName: "Los Pollitos Fanpage",
          accountUsername: "Los Pollitos Fanpage",
          externalAccountId: "fb_page_pollitos_testing",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
      });

      await prisma.socialAccount.upsert({
        where: {
          workspaceId_platform_externalAccountId: {
            workspaceId,
            platform: "INSTAGRAM",
            externalAccountId: "ig_pollitos_tv_testing",
          },
        },
        update: {
          accountName: "lospollitos_tv",
          accountUsername: "@lospollitos_tv",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
        create: {
          workspaceId,
          platform: "INSTAGRAM",
          accountName: "lospollitos_tv",
          accountUsername: "@lospollitos_tv",
          externalAccountId: "ig_pollitos_tv_testing",
          accessToken: "mock_token_active",
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("DB offline in facebook connect upsert:", dbErr);
    }

    return NextResponse.redirect(
      new URL("/admin/accounts?success=meta_connected", req.url)
    );
  } catch (error) {
    console.error("Error initiating Meta OAuth:", error);
    return NextResponse.redirect(
      new URL("/admin/accounts?error=meta_oauth_failed", req.url)
    );
  }
}
