import { HeroSection } from "@/components/sections/HeroSection";
import { RealitySection } from "@/components/sections/RealitySection";
import { FrameworkSection } from "@/components/sections/FrameworkSection";
import { InitiativeSection } from "@/components/sections/InitiativeSection";
import { RecentMovesSection } from "@/components/sections/RecentMovesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { EndgameSection } from "@/components/sections/EndgameSection";
import { getPageContent } from "@/lib/dal/site";
import { getCapabilities } from "@/lib/dal/taxonomy";
import { getFeaturedProjects } from "@/lib/dal/projects";

export default async function Home() {
  const content = await getPageContent('home');
  const capabilities = await getCapabilities();
  const featuredProjects = await getFeaturedProjects('home');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GAMBIT",
    "url": "https://gambit-co.vercel.app",
    "description": "Create positions. Defend advantages. Scale intelligently.",
  };

  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection content={content?.hero} />
      <RealitySection content={content?.reality} />
      <FrameworkSection capabilities={capabilities} content={content?.framework} />
      <InitiativeSection content={content?.initiative} />
      <RecentMovesSection projects={featuredProjects} content={content?.recent_moves} />
      <ProcessSection content={content?.process} />
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
