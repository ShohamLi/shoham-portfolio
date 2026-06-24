"use client";

import { useMemo, useState, type ReactNode } from "react";
import { SkillPill } from "@/components/ui/skill-pill";
import { SKILL_CATEGORIES, SKILLS } from "@/lib/data";
import { SECTION_PANEL } from "@/lib/styles";
import type { SkillCategory } from "@/lib/types";

function SkillChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-2xl border px-4 py-2 text-sm backdrop-blur " +
        (active ? "border-white/28 bg-white/16 text-white" : "border-white/12 bg-white/8 text-white/85")
      }
    >
      {children}
    </button>
  );
}

export function SkillsSection() {
  const [skillFilter, setSkillFilter] = useState<SkillCategory>("All");

  const visibleSkills = useMemo(() => {
    if (skillFilter === "All") return SKILLS;
    return SKILLS.filter((s) => s.category === skillFilter);
  }, [skillFilter]);

  return (
    <section id="skills" className={`mt-10 ${SECTION_PANEL}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((c) => (
            <SkillChip key={c} active={skillFilter === c} onClick={() => setSkillFilter(c)}>
              {c}
            </SkillChip>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSkills.map((s) => (
          <SkillPill key={s.name} skill={s} />
        ))}
      </div>
    </section>
  );
}
