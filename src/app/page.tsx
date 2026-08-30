import { getPublicChannelData } from "@/services/youtube-public";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicHero } from "@/components/public/hero";
import { PlaylistsSection } from "@/components/public/playlists-section";
import { VideoGrid } from "@/components/public/video-grid";
import { AboutSection } from "@/components/public/about-section";
import { PublicFooter } from "@/components/public/footer";

export const revalidate = 3600; // Incremental Static Regeneration (1 hour)

export default async function HomePage() {
  const { channel, videos } = await getPublicChannelData();
  const featuredVideo = videos[0] || undefined;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 flex flex-col">
      {/* Top Public Header */}
      <PublicNavbar />

      {/* Main Public Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <PublicHero channel={channel} featuredVideo={featuredVideo} />

        {/* Official Playlists Showcase */}
        <PlaylistsSection />

        {/* Video Catalog with Progressive Load More, Hashtags, Categories, Search, and Modal Player */}
        <VideoGrid videos={videos} />

        {/* About the Channel & Passion */}
        <AboutSection />
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
