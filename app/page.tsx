import { PageBackground } from "@/components/background/page-background";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSectionDeferred } from "@/components/sections/deferred-islands";
import { SkillsSectionStatic } from "@/components/sections/skills-section-static";
import { TopNav } from "@/components/sections/top-nav";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen text-white">
      <PageBackground />
      <TopNav />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <HeroSection />
        <AboutSection />
        <SkillsSectionDeferred>
          <SkillsSectionStatic />
        </SkillsSectionDeferred>
        <ProjectsSection />
        <ContactSection />

        <footer className="mt-12 pb-6 text-center text-xs text-white/80">
          © {year} Shoham Liebermann - Built with Next.js + Tailwind
        </footer>
      </div>
    </main>
  );
}
