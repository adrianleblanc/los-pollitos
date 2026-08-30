import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens, YOUTUBE_SCOPES } from "@/services/youtube-auth";

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

    const { tokens, channel } = await exchangeCodeForTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/admin/accounts?error=no_access_token", req.url)
      );
    }

    const externalAccountId = channel?.id || `yt_${Date.now()}`;
    const accountName = channel?.title || "Canal YouTube";
    const accountUsername = channel?.customUrl || "@AdrianLeblancMorales";
    const accountAvatarUrl = channel?.avatarUrl || "";

    const tokenExpiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    // Upsert SocialAccount in database
    await prisma.socialAccount.upsert({
      where: {
        workspaceId_platform_externalAccountId: {
          workspaceId,
          platform: "YOUTUBE",
          externalAccountId,
        },
      },
      update: {
        accountName,
        accountUsername,
        accountAvatarUrl,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt,
        tokenStatus: "ACTIVE",
        scopes: YOUTUBE_SCOPES,
        platformConfig: channel ? (channel as any) : undefined,
        configUpdatedAt: new Date(),
      },
      create: {
        workspaceId,
        platform: "YOUTUBE",
        accountName,
        accountUsername,
        accountAvatarUrl,
        externalAccountId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenExpiresAt,
        tokenStatus: "ACTIVE",
        scopes: YOUTUBE_SCOPES,
        platformConfig: channel ? (channel as any) : undefined,
        configUpdatedAt: new Date(),
      },
    });

    return NextResponse.redirect(
      new URL("/admin/accounts?success=youtube_connected", req.url)
    );
  } catch (err) {
    console.error("Error processing YouTube OAuth callback:", err);
    return NextResponse.redirect(
      new URL("/admin/accounts?error=callback_processing_failed", req.url)
    );
  }
}
