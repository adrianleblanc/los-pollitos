import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

const clientId = process.env.AUTH_GOOGLE_ID || "";
const clientSecret = process.env.AUTH_GOOGLE_SECRET || "";
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const redirectUri = `${appUrl}/api/social/youtube/callback`;

export const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getYouTubeOAuthClient() {
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates the Google OAuth 2.0 consent URL for YouTube publishing
 */
export function getYouTubeAuthUrl(workspaceId: string, testingMode: boolean = true): string {
  const oauth2Client = getYouTubeOAuthClient();

  const state = Buffer.from(
    JSON.stringify({
      workspaceId,
      testingMode,
      timestamp: Date.now(),
    })
  ).toString("base64");

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: YOUTUBE_SCOPES,
    state,
  });
}

/**
 * Exchanges authorization code for tokens and retrieves YouTube channel profile
 */
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = getYouTubeOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch YouTube Channel Details
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const channelRes = await youtube.channels.list({
    part: ["snippet", "statistics", "contentDetails"],
    mine: true,
  });

  const channel = channelRes.data.items?.[0];

  return {
    tokens,
    channel: channel
      ? {
          id: channel.id,
          title: channel.snippet?.title || "Canal YouTube",
          customUrl: channel.snippet?.customUrl || "@AdrianLeblancMorales",
          avatarUrl: channel.snippet?.thumbnails?.default?.url || "",
          subscriberCount: channel.statistics?.subscriberCount || "0",
          videoCount: channel.statistics?.videoCount || "0",
        }
      : null,
  };
}

/**
 * Retrieves valid authorized OAuth client for a workspace's YouTube connection,
 * auto-refreshing expired access tokens when needed.
 */
export async function getAuthorizedYouTubeClient(socialAccountId: string) {
  const socialAccount = await prisma.socialAccount.findUnique({
    where: { id: socialAccountId },
  });

  if (!socialAccount) {
    throw new Error("Cuenta social no encontrada");
  }

  const oauth2Client = getYouTubeOAuthClient();

  oauth2Client.setCredentials({
    access_token: socialAccount.accessToken,
    refresh_token: socialAccount.refreshToken,
    expiry_date: socialAccount.tokenExpiresAt
      ? new Date(socialAccount.tokenExpiresAt).getTime()
      : undefined,
  });

  // Check if token is expired and refresh
  if (
    socialAccount.tokenExpiresAt &&
    new Date(socialAccount.tokenExpiresAt).getTime() <= Date.now() + 60000
  ) {
    if (socialAccount.refreshToken) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);

        // Update database with fresh token
        await prisma.socialAccount.update({
          where: { id: socialAccountId },
          data: {
            accessToken: credentials.access_token || socialAccount.accessToken,
            tokenExpiresAt: credentials.expiry_date
              ? new Date(credentials.expiry_date)
              : null,
            tokenStatus: "ACTIVE",
          },
        });
      } catch (refreshErr) {
        console.error("Error refreshing YouTube token:", refreshErr);
        await prisma.socialAccount.update({
          where: { id: socialAccountId },
          data: { tokenStatus: "EXPIRED" },
        });
        throw new Error("El token de acceso de YouTube expiró y requiere reconectar.");
      }
    }
  }

  return {
    oauth2Client,
    socialAccount,
  };
}
