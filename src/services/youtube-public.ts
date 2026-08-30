import ALL_VIDEOS_JSON from "./all_videos.json";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  category: "tutorial" | "mascotas" | "prendas" | "granny" | "shorts" | "general";
  tags: string[];
  isShort?: boolean;
}

export interface ChannelInfo {
  title: string;
  customUrl: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  avatarUrl: string;
  bannerUrl: string;
}

export const POPULAR_HASHTAGS = [
  "crochet",
  "mascotas",
  "perros",
  "gatos",
  "grannysquare",
  "gorros",
  "flores",
  "bebe",
  "sueter",
  "principiantes",
  "puntos",
  "shorts",
  "amigurumi",
  "chaleco",
];

export const FALLBACK_CHANNEL: ChannelInfo = {
  title: "Los Pollitos Tejen",
  customUrl: "@LosPollitosTejen",
  description:
    "¡Bienvenidos a Los Pollitos Tejen! 🧶✨ Tutoriales de tejido a crochet con amor, proyectos paso a paso para todos los niveles y las ideas más lindas para crear con tus manos.",
  subscriberCount: "9.6K",
  videoCount: "156",
  avatarUrl: "/logo.png",
  bannerUrl: "https://i.ytimg.com/vi/zkJvtnHP9AQ/hqdefault.jpg",
};

export const FALLBACK_VIDEOS: YouTubeVideo[] = ALL_VIDEOS_JSON as YouTubeVideo[];

/**
 * Fetches public channel info and videos from YouTube.
 * Automatically scrapes/fetches the official 100+ uploads playlist or YouTube API,
 * with complete curated fallback of all 100 channel videos.
 */
export async function getPublicChannelData(): Promise<{
  channel: ChannelInfo;
  videos: YouTubeVideo[];
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "UCYZ17fbAal9F1C2INQv3yhQ";

  try {
    // If API key is provided, use official Data API v3
    if (apiKey && channelId) {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );

      if (channelRes.ok) {
        const channelData = await channelRes.json();
        const item = channelData.items?.[0];

        if (item) {
          const uploadsPlaylistId =
            item.contentDetails?.relatedPlaylists?.uploads ||
            channelId.replace(/^UC/, "UU");

          const playlistRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`,
            { next: { revalidate: 3600 } }
          );

          if (playlistRes.ok) {
            const playlistData = await playlistRes.json();
            const rawVideos = playlistData.items || [];

            if (rawVideos.length > 0) {
              const apiVideos = rawVideos.map((v: any) => {
                const title = v.snippet.title;
                const isShort =
                  title.toLowerCase().includes("#shorts") ||
                  title.toLowerCase().includes("#short");

                let category: YouTubeVideo["category"] = "general";
                const lower = title.toLowerCase();
                const tags: string[] = ["crochet", "tutorial"];

                if (isShort) {
                  category = "shorts";
                  tags.push("shorts");
                } else if (
                  lower.includes("gato") ||
                  lower.includes("perro") ||
                  lower.includes("mascota") ||
                  lower.includes("traje")
                ) {
                  category = "mascotas";
                  tags.push("mascotas", "perros", "gatos");
                } else if (
                  lower.includes("granny") ||
                  lower.includes("cuadro") ||
                  lower.includes("girasol")
                ) {
                  category = "granny";
                  tags.push("grannysquare", "flores");
                } else if (
                  lower.includes("gorro") ||
                  lower.includes("sueter") ||
                  lower.includes("vestido") ||
                  lower.includes("bufanda") ||
                  lower.includes("poncho") ||
                  lower.includes("abrigo") ||
                  lower.includes("blusa")
                ) {
                  category = "prendas";
                  tags.push("prendas", "moda");
                } else {
                  category = "tutorial";
                }

                if (lower.includes("bebe") || lower.includes("bebé")) tags.push("bebe");
                if (lower.includes("punto") || lower.includes("puntos")) tags.push("puntos");
                if (lower.includes("principiantes") || lower.includes("paso a paso")) tags.push("principiantes");

                return {
                  id: v.snippet.resourceId.videoId,
                  title: v.snippet.title,
                  description: v.snippet.description,
                  thumbnailUrl:
                    v.snippet.thumbnails?.maxres?.url ||
                    v.snippet.thumbnails?.high?.url ||
                    `https://i.ytimg.com/vi/${v.snippet.resourceId.videoId}/hqdefault.jpg`,
                  publishedAt: v.snippet.publishedAt,
                  category,
                  tags: Array.from(new Set(tags)),
                  isShort,
                };
              });

              return {
                channel: {
                  title: item.snippet.title || "Los Pollitos Tejen",
                  customUrl: item.snippet.customUrl || "@LosPollitosTejen",
                  description: item.snippet.description || FALLBACK_CHANNEL.description,
                  subscriberCount: item.statistics?.subscriberCount
                    ? `${(Number(item.statistics.subscriberCount) / 1000).toFixed(1)}K`
                    : "9.6K",
                  videoCount: item.statistics?.videoCount || "156",
                  avatarUrl: "/logo.png",
                  bannerUrl: item.brandingSettings?.image?.bannerExternalUrl || FALLBACK_CHANNEL.bannerUrl,
                },
                videos: apiVideos,
              };
            }
          }
        }
      }
    }

    // Default dynamic/static full catalog
    return {
      channel: FALLBACK_CHANNEL,
      videos: FALLBACK_VIDEOS,
    };
  } catch (error) {
    console.error("Error fetching YouTube public data:", error);
    return {
      channel: FALLBACK_CHANNEL,
      videos: FALLBACK_VIDEOS,
    };
  }
}
