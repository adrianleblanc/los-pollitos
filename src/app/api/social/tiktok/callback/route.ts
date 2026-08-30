import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeTikTokCode, TIKTOK_SCOPES } from "@/services/tiktok-auth";

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

    const { openId, accessToken, refreshToken, expiresAt, userProfile } =
      await exchangeTikTokCode(code);

    const externalAccountId = openId || `tt_${Date.now()}`;

    // Upsert TikTok SocialAccount
    await prisma.socialAccount.upsert({
      where: {
        workspaceId_platform_externalAccountId: {
          workspaceId,
          platform: "TIKTOK",
          externalAccountId,
        },
      },
      update: {
        accountName: userProfile.displayName,
        accountUsername: userProfile.username,
        accountAvatarUrl: userProfile.avatarUrl,
        accessToken,
        refreshToken,
        tokenExpiresAt: expiresAt,
        tokenStatus: "ACTIVE",
        scopes: TIKTOK_SCOPES,
        configUpdatedAt: new Date(),
      },
      create: {
        workspaceId,
        platform: "TIKTOK",
        accountName: userProfile.displayName,
        accountUsername: userProfile.username,
        accountAvatarUrl: userProfile.avatarUrl,
        externalAccountId,
        accessToken,
        refreshToken,
        tokenExpiresAt: expiresAt,
        tokenStatus: "ACTIVE",
        scopes: TIKTOK_SCOPES,
        configUpdatedAt: new Date(),
      },
    });

    return NextResponse.redirect(
      new URL("/admin/accounts?success=tiktok_connected", req.url)
    );
  } catch (err: any) {
    console.error("Error processing TikTok OAuth callback:", err);
    return NextResponse.redirect(
      new URL(
        `/admin/accounts?error=${encodeURIComponent(
          err.message || "tiktok_callback_failed"
        )}`,
        req.url
      )
    );
  }
}
