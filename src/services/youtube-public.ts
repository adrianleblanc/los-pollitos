export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  category: "tutorial" | "mascotas" | "prendas" | "shorts" | "general";
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

export const FALLBACK_CHANNEL: ChannelInfo = {
  title: "Los Pollitos Tejen",
  customUrl: "@LosPollitosTejen",
  description:
    "¡Bienvenidos a Los Pollitos Tejen! 🧶✨ Tutoriales de tejido a crochet con amor, proyectos paso a paso para todos los niveles y las ideas más lindas para crear con tus manos.",
  subscriberCount: "9.6K",
  videoCount: "156",
  avatarUrl:
    "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&auto=format&fit=crop&q=80",
  bannerUrl:
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1600&auto=format&fit=crop&q=80",
};

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "demo_1",
    title: "🐱 Traje a Crochet para Gato Fácil y Rápido | Paso a Paso",
    description:
      "Aprende a tejer un hermoso suéter / traje a crochet para tu gatito. Explicado punto por punto para principiantes.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-15T14:00:00Z",
    duration: "24:15",
    viewCount: "18.4K",
    category: "mascotas",
  },
  {
    id: "demo_2",
    title: "🕷️ Gorro Venom a Crochet | Tutorial Paso a Paso",
    description:
      "Tutorial detallado para tejer el famoso gorro inspirado en Venom con técnica de crochet y detalles en relieve.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-10T18:30:00Z",
    duration: "32:40",
    viewCount: "45.2K",
    category: "prendas",
  },
  {
    id: "demo_3",
    title: "🐶 Vestido / Suéter Rosa para Perritos a Crochet",
    description:
      "Viste a tu mascota con este hermoso diseño tejido en punto fantasía con lazos decorativos.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-01T16:00:00Z",
    duration: "28:10",
    viewCount: "29.8K",
    category: "mascotas",
  },
  {
    id: "demo_4",
    title: "🌸 Flores a Crochet para Aplicaciones y Decoración",
    description:
      "Aprende a tejer flores fáciles y coloridas en minutos. Ideales para mantas, bolsos y accesorios.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-07-25T12:00:00Z",
    duration: "15:20",
    viewCount: "12.6K",
    category: "tutorial",
  },
  {
    id: "demo_5",
    title: "🧣 Bufanda Infinita en Punto Relieve a Crochet",
    description:
      "Un proyecto abrigador y súper elegante para días fríos. Patrón fácil de seguir.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-07-18T17:00:00Z",
    duration: "22:50",
    viewCount: "34.1K",
    category: "prendas",
  },
  {
    id: "demo_6",
    title: "🐥 Pollito Amigurumi Tierno | Patrón Gratis para Principiantes",
    description:
      "El pollito insignia de nuestro canal tejido en técnica amigurumi. Ideal para llaveros o regalos.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-07-10T15:30:00Z",
    duration: "19:45",
    viewCount: "58.7K",
    category: "tutorial",
  },
  {
    id: "demo_7",
    title: "✨ Tip Rápido: Cómo unir hebras de lana sin nudos visibles #Shorts",
    description:
      "Un truco esencial que cambiará la prolijidad de tus tejidos a crochet.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-20T19:00:00Z",
    duration: "0:58",
    viewCount: "92.4K",
    category: "shorts",
    isShort: true,
  },
  {
    id: "demo_8",
    title: "🧶 Cómo calcular la cantidad de lana para tu proyecto #Shorts",
    description:
      "Nunca más te quedes a mitad de camino en tus prendas de crochet.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-18T20:00:00Z",
    duration: "0:45",
    viewCount: "67.1K",
    category: "shorts",
    isShort: true,
  },
];

/**
 * Fetches public channel info and videos from YouTube Data API v3.
 * If API Key is not set or quota is exceeded, gracefully returns curated real channel data.
 */
export async function getPublicChannelData(): Promise<{
  channel: ChannelInfo;
  videos: YouTubeVideo[];
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return {
      channel: FALLBACK_CHANNEL,
      videos: FALLBACK_VIDEOS,
    };
  }

  try {
    // 1. Fetch Channel Details (Cost: 1 unit)
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache 1 hour
    );

    if (!channelRes.ok) {
      return { channel: FALLBACK_CHANNEL, videos: FALLBACK_VIDEOS };
    }

    const channelData = await channelRes.json();
    const item = channelData.items?.[0];

    if (!item) {
      return { channel: FALLBACK_CHANNEL, videos: FALLBACK_VIDEOS };
    }

    const uploadsPlaylistId =
      item.contentDetails?.relatedPlaylists?.uploads ||
      channelId.replace(/^UC/, "UU");

    // 2. Fetch Uploads from Playlist (Cost: 1 unit)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=20&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    let videos = FALLBACK_VIDEOS;

    if (playlistRes.ok) {
      const playlistData = await playlistRes.json();
      const rawVideos = playlistData.items || [];

      if (rawVideos.length > 0) {
        videos = rawVideos.map((v: any) => {
          const title = v.snippet.title;
          const isShort =
            title.toLowerCase().includes("#shorts") ||
            title.toLowerCase().includes("#short");

          let category: YouTubeVideo["category"] = "general";
          const lower = title.toLowerCase();
          if (isShort) category = "shorts";
          else if (
            lower.includes("gato") ||
            lower.includes("perro") ||
            lower.includes("mascota")
          )
            category = "mascotas";
          else if (
            lower.includes("gorro") ||
            lower.includes("sueter") ||
            lower.includes("vestido") ||
            lower.includes("bufanda")
          )
            category = "prendas";
          else if (lower.includes("tutorial") || lower.includes("paso a paso"))
            category = "tutorial";

          return {
            id: v.snippet.resourceId.videoId,
            title: v.snippet.title,
            description: v.snippet.description,
            thumbnailUrl:
              v.snippet.thumbnails?.maxres?.url ||
              v.snippet.thumbnails?.high?.url ||
              v.snippet.thumbnails?.medium?.url,
            publishedAt: v.snippet.publishedAt,
            category,
            isShort,
          };
        });
      }
    }

    const channel: ChannelInfo = {
      title: item.snippet.title || "Los Pollitos Tejen",
      customUrl: item.snippet.customUrl || "@LosPollitosTejen",
      description: item.snippet.description || FALLBACK_CHANNEL.description,
      subscriberCount: item.statistics?.subscriberCount
        ? `${(Number(item.statistics.subscriberCount) / 1000).toFixed(1)}K`
        : "9.6K",
      videoCount: item.statistics?.videoCount || "156",
      avatarUrl:
        item.snippet.thumbnails?.high?.url || FALLBACK_CHANNEL.avatarUrl,
      bannerUrl:
        item.brandingSettings?.image?.bannerExternalUrl ||
        FALLBACK_CHANNEL.bannerUrl,
    };

    return { channel, videos };
  } catch (error) {
    console.error("Error fetching YouTube public data:", error);
    return {
      channel: FALLBACK_CHANNEL,
      videos: FALLBACK_VIDEOS,
    };
  }
}
