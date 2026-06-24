import React from "react";
import Image from "next/image";
import { IconByName } from "@/components/icons/icon-by-name";
import { IconGitHub } from "@/components/icons";
import { ActionLink, TagSquare } from "@/components/ui/nav";
import { PROJECTS } from "@/lib/data";
import { PROJECT_CARD } from "@/lib/styles";

export function ProjectsSection() {
  return (
    <section id="projects" className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <span className="text-sm text-white/85">Selected work ({PROJECTS.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <article key={p.title} className={PROJECT_CARD}>
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
              <div className="absolute inset-0 ring-1 ring-white/10" />

              <div className="absolute left-4 top-4 inline-flex items-center justify-center rounded-2xl border border-white/12 bg-[#03040a]/35 p-3 text-white/90 backdrop-blur">
                <IconByName name={p.logoIcon} className="h-5 w-5" />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-white/90">{p.subtitle}</p>

              <p className="mt-3 text-white/95 leading-relaxed">{p.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <TagSquare key={t}>{t}</TagSquare>
                ))}
              </div>

              <div className="mt-6">
                <ActionLink href={p.githubUrl} icon={<IconGitHub />} external>
                  Code →
                </ActionLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
