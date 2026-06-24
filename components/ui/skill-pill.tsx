import React from "react";
import { IconByName } from "@/components/icons/icon-by-name";
import { CATEGORY_TONE, LogoBox } from "@/components/ui/logo-box";
import type { Skill } from "@/lib/types";

export function SkillPill({ skill }: { skill: Skill }) {
  const tone = CATEGORY_TONE[skill.category];
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur transition hover:border-white/18 hover:bg-white/10">
      <LogoBox tone={tone}>
        <IconByName name={skill.icon} />
      </LogoBox>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white/95 leading-tight">{skill.name}</div>
        <div className="text-xs text-white/70">{skill.category}</div>
      </div>
    </div>
  );
}
