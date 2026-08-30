import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMetaAuthUrl, META_SCOPES } from "@/services/meta-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    let workspaceId = session?.user?.currentWorkspaceId;

    if (!workspaceId) {
      const defaultWorkspace = await prisma.workspace.findFirst();
      workspaceId = defaultWorkspace?.id;
    }

    if (!workspaceId) {
      const created = await prisma.workspace.create({
        data: { name: "Los Pollitos", slug: "los-pollitos" },
      });
      workspaceId = created.id;
    }

    const hasRealMetaCredentials =
      (process.env.META_APP_ID || process.env.AUTH_FACEBOOK_ID) &&
      !process.env.META_APP_ID?.includes("dev_");

    if (hasRealMetaCredentials) {
      const authUrl = getMetaAuthUrl(workspaceId);
      return NextResponse.redirect(authUrl);
    }

    // Local dev sandbox connection
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
