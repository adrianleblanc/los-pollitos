import { prisma } from "@/lib/prisma";

const appId = process.env.META_APP_ID || process.env.AUTH_FACEBOOK_ID || "";
const appSecret = process.env.META_APP_SECRET || process.env.AUTH_FACEBOOK_SECRET || "";
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const redirectUri = `${appUrl}/api/social/facebook/callback`;

export const META_GRAPH_VERSION = "v26.0";
const GRAPH_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "publish_video",
  "instagram_basic",
  "instagram_content_publish",
  "business_management",
  "public_profile",
  "email",
];

export function getMetaAuthUrl(workspaceId: string): string {
  const state = Buffer.from(
    JSON.stringify({
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64");

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    scope: META_SCOPES.join(","),
    response_type: "code",
  });

  return `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchanges auth code for short-lived token, then exchanges for long-lived user token (60 days),
 * and finally fetches user's Facebook Pages and linked Instagram Business accounts.
 */
export async function exchangeMetaCodeForAccounts(code: string) {
  // 1. Exchange code for short-lived user token
  const tokenUrl = `${GRAPH_URL}/oauth/access_token?${new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  }).toString()}`;

  const tokenRes = await fetch(tokenUrl);
  if (!tokenRes.ok) {
    const err = await tokenRes.json();
    throw new Error(err.error?.message || "Error al obtener token de Meta");
  }

  const tokenData = await tokenRes.json();
  const shortLivedToken = tokenData.access_token;

  // 2. Exchange for long-lived user token (60 days)
  const longLivedUrl = `${GRAPH_URL}/oauth/access_token?${new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  }).toString()}`;

  const longLivedRes = await fetch(longLivedUrl);
  const longLivedData = await longLivedRes.json();
  const longLivedUserToken = longLivedData.access_token || shortLivedToken;

  // 3. Fetch user's Facebook Pages and linked Instagram accounts
  const accountsUrl = `${GRAPH_URL}/me/accounts?${new URLSearchParams({
    fields: "id,name,access_token,category,instagram_business_account{id,username,profile_picture_url}",
    access_token: longLivedUserToken,
  }).toString()}`;

  const accountsRes = await fetch(accountsUrl);
  if (!accountsRes.ok) {
    const err = await accountsRes.json();
    throw new Error(err.error?.message || "Error al obtener Páginas de Facebook");
  }

  const accountsData = await accountsRes.json();
  const pages = accountsData.data || [];

  return {
    longLivedUserToken,
    pages: pages.map((page: any) => ({
      pageId: page.id,
      pageName: page.name,
      pageToken: page.access_token, // Permanent page token derived from long-lived user token
      instagram: page.instagram_business_account
        ? {
            igId: page.instagram_business_account.id,
            username: page.instagram_business_account.username,
            avatarUrl: page.instagram_business_account.profile_picture_url,
          }
        : null,
    })),
  };
}
