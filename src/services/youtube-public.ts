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
    tags: ["crochet", "mascotas", "perros", "gatos", "sueter", "chaleco", "invierno"],
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
    tags: ["crochet", "gorros", "venom", "prendas", "geek", "pasoapaso"],
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
    tags: ["crochet", "mascotas", "perros", "gatos", "chaleco", "principiantes"],
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
    category: "granny",
    tags: ["crochet", "grannysquare", "girasol", "flores", "mantas", "tutorial"],
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
    category: "granny",
    tags: ["crochet", "grannysquare", "flores", "tutorial", "cojines"],
  },
  {
    id: "V-TpwPm55vo",
    title: "✨ Granny Square a Crochet #11 - Paso a Paso",
    description:
      "Diseño moderno de granny square multicolor explicado vuelta por vuelta.",
    thumbnailUrl: "https://i.ytimg.com/vi/V-TpwPm55vo/hqdefault.jpg",
    publishedAt: "2026-07-18T16:00:00Z",
    duration: "24:58",
    viewCount: "17.9K",
    category: "granny",
    tags: ["crochet", "grannysquare", "tutorial", "principiantes"],
  },
  {
    id: "MsLdKcyTL8Y",
    title: "🧶 Granny Square a Crochet #10 - Cuadro Clásico",
    description:
      "Patrón fundamental de granny square para proyectos modulares de tejido a ganchillo.",
    thumbnailUrl: "https://i.ytimg.com/vi/MsLdKcyTL8Y/hqdefault.jpg",
    publishedAt: "2026-07-16T14:30:00Z",
    duration: "19:27",
    viewCount: "24.1K",
    category: "granny",
    tags: ["crochet", "grannysquare", "tutorial", "clasico"],
  },
  {
    id: "3RQIie5V--o",
    title: "🔷 Granny Square Hexágono a Crochet #8 - Paso a Paso",
    description:
      "Aprende a tejer hexágonos a crochet para cardigans, chaquetas y mantas con geometría perfecta.",
    thumbnailUrl: "https://i.ytimg.com/vi/3RQIie5V--o/hqdefault.jpg",
    publishedAt: "2026-07-12T13:00:00Z",
    duration: "13:47",
    viewCount: "19.5K",
    category: "granny",
    tags: ["crochet", "grannysquare", "hexagono", "cardigan", "tutorial"],
  },
  {
    id: "lKvyRw5yr8A",
    title: "📐 Granny Square a Crochet #7 - Cuadro con Textura",
    description:
      "Aprende este patrón de cuadro con texturas en relieve para proyectos elegantes.",
    thumbnailUrl: "https://i.ytimg.com/vi/lKvyRw5yr8A/hqdefault.jpg",
    publishedAt: "2026-07-08T18:00:00Z",
    duration: "18:59",
    viewCount: "15.8K",
    category: "granny",
    tags: ["crochet", "grannysquare", "puntos", "texturas"],
  },
  {
    id: "n7cIrENty1k",
    title: "🌟 Granny Square a Crochet #6 - Estrella Central",
    description:
      "Motivo en cuadro de la abuela con estrella de puntas para mantas de recién nacido.",
    thumbnailUrl: "https://i.ytimg.com/vi/n7cIrENty1k/hqdefault.jpg",
    publishedAt: "2026-07-04T12:00:00Z",
    duration: "21:53",
    viewCount: "26.3K",
    category: "granny",
    tags: ["crochet", "grannysquare", "estrella", "bebe", "mantas"],
  },
  {
    id: "TfV5IsBMxIw",
    title: "🐶🐱 Hamaca a Crochet para Gatos y Perros | Fácil y Resistente",
    description:
      "Crea una cama / hamaca colgante tejida súper resistente y cómoda para el descanso de tus mascotas.",
    thumbnailUrl: "https://i.ytimg.com/vi/TfV5IsBMxIw/hqdefault.jpg",
    publishedAt: "2026-07-01T17:30:00Z",
    duration: "17:23",
    viewCount: "27.5K",
    category: "mascotas",
    tags: ["crochet", "mascotas", "gatos", "perros", "accesorios", "hogar"],
  },
  {
    id: "yKDxDRIFoUs",
    title: "🧣 Poncho Tejido a Crochet para Todas las Tallas",
    description:
      "Prenda elegante y abrigadora tejida en punto fantasía con terminaciones en flecos.",
    thumbnailUrl: "https://i.ytimg.com/vi/yKDxDRIFoUs/hqdefault.jpg",
    publishedAt: "2026-06-25T14:00:00Z",
    duration: "23:22",
    viewCount: "58.7K",
    category: "prendas",
    tags: ["crochet", "prendas", "poncho", "invierno", "moda"],
  },
  {
    id: "mgzaghyFkhM",
    title: "👚 Blusa / Polera Tejida a Crochet #2",
    description:
      "Diseño calado fresco y primaveral para tejer tu propia blusa a medida paso a paso.",
    thumbnailUrl: "https://i.ytimg.com/vi/mgzaghyFkhM/hqdefault.jpg",
    publishedAt: "2026-06-20T16:00:00Z",
    duration: "23:28",
    viewCount: "31.2K",
    category: "prendas",
    tags: ["crochet", "prendas", "blusa", "verano", "moda"],
  },
  {
    id: "qTLkSFziIfc",
    title: "🧥 Abrigo / Chaqueta Tejida a Crochet para Todas las Tallas",
    description:
      "Aprende a tejer un abrigo cómodo y grueso con bolsillos y capucha explicada paso a paso.",
    thumbnailUrl: "https://i.ytimg.com/vi/qTLkSFziIfc/hqdefault.jpg",
    publishedAt: "2026-06-15T19:00:00Z",
    duration: "39:35",
    viewCount: "64.0K",
    category: "prendas",
    tags: ["crochet", "prendas", "abrigo", "chaqueta", "invierno"],
  },
  {
    id: "akEXHi2Jb74",
    title: "👶 Gorro de Bebé a Crochet con Orejitas",
    description:
      "Tierno gorrito para recién nacido y bebé tejido con lana suave hipoalergénica.",
    thumbnailUrl: "https://i.ytimg.com/vi/akEXHi2Jb74/hqdefault.jpg",
    publishedAt: "2026-06-10T11:00:00Z",
    duration: "30:52",
    viewCount: "34.1K",
    category: "prendas",
    tags: ["crochet", "gorros", "bebe", "regalos", "tierno"],
  },
  {
    id: "IxKaSEqFro0",
    title: "🎀 Moño Coquette a Crochet Ideal para Principiantes",
    description:
      "Aprende a tejer un hermoso lazo / moño estilo coquette para el cabello o aplicaciones en prendas.",
    thumbnailUrl: "https://i.ytimg.com/vi/IxKaSEqFro0/hqdefault.jpg",
    publishedAt: "2026-06-05T16:20:00Z",
    duration: "12:42",
    viewCount: "19.8K",
    category: "tutorial",
    tags: ["crochet", "accesorios", "coquette", "principiantes", "tutorial"],
  },
  {
    id: "-b8V-szqI-g",
    title: "🍼 Saco de Dormir para Bebé a Crochet",
    description:
      "Proyecto completo paso a paso para mantener calentito a tu bebé con botones de madera decorativos.",
    thumbnailUrl: "https://i.ytimg.com/vi/-b8V-szqI-g/hqdefault.jpg",
    publishedAt: "2026-05-28T18:00:00Z",
    duration: "24:01",
    viewCount: "42.0K",
    category: "prendas",
    tags: ["crochet", "bebe", "saco", "invierno", "regalos"],
  },
  {
    id: "E7RwJeO6jS0",
    title: "🧸 Manta de Bebé a Crochet #2 en Punto Fantasía",
    description:
      "Tutorial paso a paso para tejer una manta suavecita con borde en ondas.",
    thumbnailUrl: "https://i.ytimg.com/vi/E7RwJeO6jS0/hqdefault.jpg",
    publishedAt: "2026-05-20T15:00:00Z",
    duration: "15:55",
    viewCount: "38.5K",
    category: "tutorial",
    tags: ["crochet", "bebe", "mantas", "puntos", "tutorial"],
  },
  {
    id: "pMAbrvYM71A",
    title: "🪡 Punto Tejido a Crochet #26 con Textura",
    description:
      "Muestrario de puntos a crochet: técnica, múltiplos de cadenetas y aplicaciones.",
    thumbnailUrl: "https://i.ytimg.com/vi/pMAbrvYM71A/hqdefault.jpg",
    publishedAt: "2026-05-15T12:00:00Z",
    duration: "10:20",
    viewCount: "14.2K",
    category: "tutorial",
    tags: ["crochet", "puntos", "muestrario", "tutorial", "principiantes"],
  },
  {
    id: "ahq3fdM-K9E",
    title: "🪡 Punto Tejido a Crochet #25 - Punto Calado",
    description:
      "Aprende este punto calado rápido y rendidor para chales, blusas y cortinas.",
    thumbnailUrl: "https://i.ytimg.com/vi/ahq3fdM-K9E/hqdefault.jpg",
    publishedAt: "2026-05-08T14:00:00Z",
    duration: "10:02",
    viewCount: "16.8K",
    category: "tutorial",
    tags: ["crochet", "puntos", "calado", "tutorial"],
  },
  {
    id: "l40aN-cMW_8",
    title: "🪡 Punto Tejido a Crochet #24 - Punto Espiga",
    description:
      "Elegante punto espiga en relieve ideal para bufandas, mantas y gorros gruesos.",
    thumbnailUrl: "https://i.ytimg.com/vi/l40aN-cMW_8/hqdefault.jpg",
    publishedAt: "2026-05-01T16:00:00Z",
    duration: "10:40",
    viewCount: "22.1K",
    category: "tutorial",
    tags: ["crochet", "puntos", "espiga", "relieve", "tutorial"],
  },
  {
    id: "HJPS6ZNQA7Q",
    title: "🪡 Punto Tejido a Crochet #23 - Punto Trenzado",
    description:
      "Cómo hacer ochos y trenzas falsas a crochet de manera sencilla sin aguja auxiliar.",
    thumbnailUrl: "https://i.ytimg.com/vi/HJPS6ZNQA7Q/hqdefault.jpg",
    publishedAt: "2026-04-24T18:00:00Z",
    duration: "11:30",
    viewCount: "28.4K",
    category: "tutorial",
    tags: ["crochet", "puntos", "trenzas", "tutorial", "avanzado"],
  },
  {
    id: "0HB3zfgoKK0",
    title: "🪡 Punto Tejido a Crochet #22 - Punto Cesta",
    description:
      "Aprende el clásico punto cesta o canasta con varetas en relieve por delante y detrás.",
    thumbnailUrl: "https://i.ytimg.com/vi/0HB3zfgoKK0/hqdefault.jpg",
    publishedAt: "2026-04-18T13:00:00Z",
    duration: "9:21",
    viewCount: "35.9K",
    category: "tutorial",
    tags: ["crochet", "puntos", "cesta", "relieve", "tutorial"],
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
    tags: ["crochet", "shorts", "trucos", "cordon", "principiantes"],
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
    tags: ["crochet", "shorts", "scrunchie", "accesorios", "rapido"],
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

    // 2. Fetch Uploads from Playlist (Cost: 1 unit, fetch up to 50 videos)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`,
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
      avatarUrl: "/logo.png",
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
