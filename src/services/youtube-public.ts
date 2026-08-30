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
  avatarUrl: "https://i.ytimg.com/vi/bd25PBimhCM/hqdefault.jpg",
  bannerUrl: "https://i.ytimg.com/vi/zkJvtnHP9AQ/hqdefault.jpg",
};

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "bd25PBimhCM",
    title: "🐶🐱 Traje a Crochet para Perros y Gatos #9 | Sweaters | Chaleco",
    description:
      "Aprende a tejer un hermoso suéter / traje a crochet para tu mascota explicado punto por punto con medidas exactas.",
    thumbnailUrl: "https://i.ytimg.com/vi/bd25PBimhCM/hqdefault.jpg",
    publishedAt: "2026-08-15T14:00:00Z",
    duration: "43:47",
    viewCount: "18.4K",
    category: "mascotas",
  },
  {
    id: "zkJvtnHP9AQ",
    title: "🕷️ Gorro Venom a Crochet | Tutorial Paso a Paso",
    description:
      "Tutorial completo para tejer el gorro inspirado en Venom a crochet con detalles en relieve y ojos bordados.",
    thumbnailUrl: "https://i.ytimg.com/vi/zkJvtnHP9AQ/hqdefault.jpg",
    publishedAt: "2026-08-10T18:30:00Z",
    duration: "44:27",
    viewCount: "45.2K",
    category: "prendas",
  },
  {
    id: "sBrf3wxRU4M",
    title: "🐶🐱 Traje a Crochet para Perros y Gatos #8 | Sin Mangas",
    description:
      "Diseño fresco y cómodo sin mangas para perritos y gatitos. Patrón fácil ideal para principiantes.",
    thumbnailUrl: "https://i.ytimg.com/vi/sBrf3wxRU4M/hqdefault.jpg",
    publishedAt: "2026-08-01T16:00:00Z",
    duration: "31:05",
    viewCount: "29.8K",
    category: "mascotas",
  },
  {
    id: "0A0otH_G1yY",
    title: "🌻 Granny Square Girasol a Crochet #9 - Paso a Paso",
    description:
      "Aprende a tejer un hermoso motivo de girasol en cuadro de la abuela (granny square) para mantas y bolsos.",
    thumbnailUrl: "https://i.ytimg.com/vi/0A0otH_G1yY/hqdefault.jpg",
    publishedAt: "2026-07-25T12:00:00Z",
    duration: "25:16",
    viewCount: "32.6K",
    category: "tutorial",
  },
  {
    id: "Yu-XYOUPSy0",
    title: "🌸 Granny Square a Crochet #12 - Flor en Relieve",
    description:
      "Tutorial paso a paso de cuadro granny con flor central en relieve para cojines y mantas tejidas.",
    thumbnailUrl: "https://i.ytimg.com/vi/Yu-XYOUPSy0/hqdefault.jpg",
    publishedAt: "2026-07-20T15:00:00Z",
    duration: "20:02",
    viewCount: "21.3K",
    category: "tutorial",
  },
  {
    id: "TfV5IsBMxIw",
    title: "🐶🐱 Hamaca a Crochet para Gatos y Perros | Fácil y Resistente",
    description:
      "Crea una cama / hamaca colgante tejida súper resistente y cómoda para el descanso de tus mascotas.",
    thumbnailUrl: "https://i.ytimg.com/vi/TfV5IsBMxIw/hqdefault.jpg",
    publishedAt: "2026-07-15T17:30:00Z",
    duration: "17:23",
    viewCount: "27.5K",
    category: "mascotas",
  },
  {
    id: "yKDxDRIFoUs",
    title: "🧣 Poncho Tejido a Crochet para Todas las Tallas",
    description:
      "Prenda elegante y abrigadora tejida en punto fantasía con terminaciones en flecos.",
    thumbnailUrl: "https://i.ytimg.com/vi/yKDxDRIFoUs/hqdefault.jpg",
    publishedAt: "2026-07-10T14:00:00Z",
    duration: "23:22",
    viewCount: "58.7K",
    category: "prendas",
  },
  {
    id: "akEXHi2Jb74",
    title: "👶 Gorro de Bebé a Crochet con Orejitas",
    description:
      "Tierno gorrito para recién nacido y bebé tejido con lana suave hipoalergénica.",
    thumbnailUrl: "https://i.ytimg.com/vi/akEXHi2Jb74/hqdefault.jpg",
    publishedAt: "2026-07-05T11:00:00Z",
    duration: "30:52",
    viewCount: "34.1K",
    category: "prendas",
  },
  {
    id: "IxKaSEqFro0",
    title: "🎀 Moño Coquette a Crochet Ideal para Principiantes",
    description:
      "Aprende a tejer un hermoso lazo / moño estilo coquette para el cabello o aplicaciones en prendas.",
    thumbnailUrl: "https://i.ytimg.com/vi/IxKaSEqFro0/hqdefault.jpg",
    publishedAt: "2026-06-28T16:20:00Z",
    duration: "12:42",
    viewCount: "19.8K",
    category: "tutorial",
  },
  {
    id: "-b8V-szqI-g",
    title: "🍼 Saco de Dormir para Bebé a Crochet",
    description:
      "Proyecto completo paso a paso para mantener calentito a tu bebé con botones de madera decorativos.",
    thumbnailUrl: "https://i.ytimg.com/vi/-b8V-szqI-g/hqdefault.jpg",
    publishedAt: "2026-06-20T18:00:00Z",
    duration: "24:01",
    viewCount: "42.0K",
    category: "prendas",
  },
  {
    id: "eYyMUMPS2FE",
    title: "✨ Cómo tejer un cordón a crochet paso a paso #Shorts",
    description:
      "Técnica rápida para cordones resistentes de bolsas, asas y lazos.",
    thumbnailUrl: "https://i.ytimg.com/vi/eYyMUMPS2FE/hqdefault.jpg",
    publishedAt: "2026-08-20T19:00:00Z",
    duration: "0:58",
    viewCount: "92.4K",
    category: "shorts",
    isShort: true,
  },
  {
    id: "MeTgkesaWwU",
    title: "🧶 Colet / Scrunchie a Crochet para el Cabello #Shorts",
    description:
      "Crea coleteros elásticos coloridos con restos de lana en menos de 10 minutos.",
    thumbnailUrl: "https://i.ytimg.com/vi/MeTgkesaWwU/hqdefault.jpg",
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
          else if (lower.includes("tutorial") || lower.includes("paso a paso") || lower.includes("granny"))
            category = "tutorial";

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
