import { HeroSection } from "@/components/sections/HeroSection";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { RealitySection } from "@/components/sections/RealitySection";
import { InitiativeSection } from "@/components/sections/InitiativeSection";
import { RecentMovesSection } from "@/components/sections/RecentMovesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { EndgameSection } from "@/components/sections/EndgameSection";
import { getPageContent } from "@/lib/dal/site";
import { getCapabilities } from "@/lib/dal/taxonomy";
import { getFeaturedProjects } from "@/lib/dal/projects";
import { mergeSeoMetadata } from "@/lib/seo-helper";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return mergeSeoMetadata('/', {
    title: "GAMBIT - Strategic Digital Agency",
    description: "Create positions. Defend advantages. Scale intelligently.",
    alternates: {
      canonical: "/",
    }
  });
}

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
      <WhatWeDoSection capabilities={capabilities} content={content?.what_we_do} />
      <RealitySection content={content?.reality} />
      <RecentMovesSection projects={featuredProjects} content={content?.recent_moves} />
      <ProcessSection content={content?.process} />
      <InitiativeSection content={content?.initiative} />
      <EndgameSection content={content?.endgame} />
    </main>
  );
}
