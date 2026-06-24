import React from "react";
import Image from "next/image";
import { IconGitHub, IconLinkedIn, IconMail } from "@/components/icons";
import { RoleTile, SocialIconButton } from "@/components/ui/nav";
import { HERO_IMAGE, LINKS, ROLE_WISHLIST } from "@/lib/constants";
import { HERO_PANEL } from "@/lib/styles";

export function HeroSection() {
  return (
    <section className={HERO_PANEL}>
      <div className="grid gap-10 p-7 md:grid-cols-12 md:p-10">
        <div className="min-w-0 md:col-span-7">
          <h1 className="max-w-[16ch] text-balance text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.02] text-sky-200 drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]">
            Shoham Liebermann
          </h1>

          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white/95">Software Engineer</h2>
          <p className="mt-3 text-lg text-white/90">Computer Science Graduate</p>

          <div className="mt-6">
            <div className="text-xs text-white/70">Target roles</div>
            <div className="mt-3 grid max-w-sm grid-cols-2 gap-3">
              {ROLE_WISHLIST.map((r) => (
                <RoleTile key={r} label={r} />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <SocialIconButton href={LINKS.github} label="GitHub" icon={<IconGitHub />} />
            <SocialIconButton href={LINKS.linkedin} label="LinkedIn" icon={<IconLinkedIn />} />
            <SocialIconButton href={LINKS.email} label="Email" icon={<IconMail />} />
          </div>
        </div>

        <div className="md:col-span-5 md:flex md:justify-end">
          <div className="w-full max-w-none md:w-[520px] lg:w-[600px]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.50)]">
              <div className="relative w-full aspect-[3/5]">
                <Image
                  src={HERO_IMAGE}
                  alt="Shoham hero"
                  fill
                  priority
                  quality={75}
                  sizes="(max-width: 767px) calc(100vw - 104px), (max-width: 1279px) 35vw, 410px"
                  className="object-cover object-[50%_30%] scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/10" />
                <div className="absolute inset-0 ring-1 ring-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
