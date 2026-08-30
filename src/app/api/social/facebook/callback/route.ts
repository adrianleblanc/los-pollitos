import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeMetaCodeForAccounts, META_SCOPES } from "@/services/meta-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !stateRaw) {
    return NextResponse.redirect(
      new URL(`/admin/accounts?error=${error || "missing_code"}`, req.url)
    );
  }

  try {
    const state = JSON.parse(Buffer.from(stateRaw, "base64").toString("utf-8"));
    const workspaceId = state.workspaceId;

    if (!workspaceId) {
      return NextResponse.redirect(
        new URL("/admin/accounts?error=invalid_state", req.url)
      );
    }

    const { pages } = await exchangeMetaCodeForAccounts(code);

    if (!pages || pages.length === 0) {
      return NextResponse.redirect(
        new URL("/admin/accounts?error=no_pages_found", req.url)
      );
    }

    // Save Facebook Page(s) & linked Instagram Account(s)
    for (const page of pages) {
      // 1. Upsert Facebook Page SocialAccount
      await prisma.socialAccount.upsert({
        where: {
          workspaceId_platform_externalAccountId: {
            workspaceId,
            platform: "FACEBOOK",
            externalAccountId: page.pageId,
          },
        },
        update: {
          accountName: page.pageName,
          accountUsername: page.pageName,
          accessToken: page.pageToken,
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
        create: {
          workspaceId,
          platform: "FACEBOOK",
          accountName: page.pageName,
          accountUsername: page.pageName,
          externalAccountId: page.pageId,
          accessToken: page.pageToken,
          tokenStatus: "ACTIVE",
          scopes: META_SCOPES,
          configUpdatedAt: new Date(),
        },
      });

      // 2. If Instagram Business account is linked to this page, upsert it too
      if (page.instagram) {
        await prisma.socialAccount.upsert({
          where: {
            workspaceId_platform_externalAccountId: {
              workspaceId,
              platform: "INSTAGRAM",
              externalAccountId: page.instagram.igId,
            },
          },
          update: {
            accountName: page.instagram.username,
            accountUsername: `@${page.instagram.username}`,
            accountAvatarUrl: page.instagram.avatarUrl,
            accessToken: page.pageToken,
            tokenStatus: "ACTIVE",
            scopes: META_SCOPES,
            configUpdatedAt: new Date(),
          },
          create: {
            workspaceId,
            platform: "INSTAGRAM",
            accountName: page.instagram.username,
            accountUsername: `@${page.instagram.username}`,
            accountAvatarUrl: page.instagram.avatarUrl,
            externalAccountId: page.instagram.igId,
            accessToken: page.pageToken,
            tokenStatus: "ACTIVE",
            scopes: META_SCOPES,
            configUpdatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL("/admin/accounts?success=meta_connected", req.url)
    );
  } catch (err: any) {
    console.error("Error processing Meta OAuth callback:", err);
    return NextResponse.redirect(
      new URL(`/admin/accounts?error=${encodeURIComponent(err.message || "callback_failed")}`, req.url)
    );
  }
}
