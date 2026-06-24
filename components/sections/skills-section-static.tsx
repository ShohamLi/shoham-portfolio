import { SkillPill } from "@/components/ui/skill-pill";
import { SKILL_CATEGORIES, SKILLS } from "@/lib/data";
import { SECTION_PANEL } from "@/lib/styles";

/** Server-rendered skills section (All filter) — shown until client island loads */

export function SkillsSectionStatic() {
  return (
    <section id="skills" className={`mt-10 ${SECTION_PANEL}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((c) => (
            <span
              key={c}
              className={
                "rounded-2xl border px-4 py-2 text-sm backdrop-blur " +
                (c === "All"
                  ? "border-white/28 bg-white/16 text-white"
                  : "border-white/12 bg-white/8 text-white/85")
              }
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((s) => (
          <SkillPill key={s.name} skill={s} />
        ))}
      </div>
    </section>
  );
}
