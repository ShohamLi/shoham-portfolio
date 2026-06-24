import React from "react";
import { IconCV } from "@/components/icons";
import { NavLink } from "@/components/ui/nav";
import { LINKS } from "@/lib/constants";

export function TopNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#03040a]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="text-sm text-white/85">
          <span className="font-semibold text-white">Shoham Liebermann</span>
        </div>

        <div className="hidden gap-2 md:flex">
          <NavLink href="#about" label="About" />
          <NavLink href="#skills" label="Skills" />
          <NavLink href="#projects" label="Projects" />
          <NavLink href="#contact" label="Contact" />
          <NavLink href={LINKS.resume} label="CV" icon={<IconCV className="h-4 w-4" />} external />
        </div>
      </div>
    </div>
  );
}
