import { prisma } from "@/lib/prisma";

const clientKey = process.env.TIKTOK_CLIENT_KEY || "";
const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "";
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const redirectUri = `${appUrl}/api/social/tiktok/callback`;

export const TIKTOK_SCOPES = [
  "user.info.basic",
  "user.info.profile",
  "user.info.stats",
  "video.publish",
  "video.upload",
];

export function getTikTokAuthUrl(workspaceId: string): string {
  const state = Buffer.from(
    JSON.stringify({
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64");

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: TIKTOK_SCOPES.join(","),
    response_type: "code",
    redirect_uri: redirectUri,
    state,
  });

  return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
}

/**
 * Exchanges authorization code for TikTok access & refresh tokens and fetches creator info
 */
export async function exchangeTikTokCode(code: string) {
  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }).toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || tokenData.error) {
    throw new Error(
      tokenData.error_description || tokenData.message || "Error al obtener tokens de TikTok"
    );
  }

  const {
    open_id,
    access_token,
    expires_in,
    refresh_token,
    refresh_expires_in,
    scope,
  } = tokenData.data || tokenData;

  // Fetch creator profile info
  let userProfile = null;
  try {
    const userRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (userRes.ok) {
      const userData = await userRes.json();
      userProfile = userData.data?.user;
    }
  } catch (err) {
    console.warn("Could not fetch TikTok user info:", err);
  }

  return {
    openId: open_id || userProfile?.open_id,
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: new Date(Date.now() + (expires_in || 86400) * 1000),
    userProfile: {
      displayName: userProfile?.display_name || "Creador TikTok",
      username: userProfile?.username ? `@${userProfile.username}` : "@lospollitos_tiktok",
      avatarUrl: userProfile?.avatar_url || "",
    },
  };
}
