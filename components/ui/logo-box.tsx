import type { ReactNode } from "react";
import type { SkillCategory } from "@/lib/types";

export const CATEGORY_TONE: Record<Exclude<SkillCategory, "All">, "sky" | "violet" | "emerald" | "amber" | "slate"> = {
  "Programming Languages": "sky",
  Frontend: "violet",
  Backend: "emerald",
  "Testing & Automation": "amber",
  "AI & Data": "slate",
  Tools: "slate",
};

export function LogoBox({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "violet" | "emerald" | "amber" | "slate";
}) {
  const bg =
    tone === "sky"
      ? "bg-[radial-gradient(circle_at_30%_25%,rgba(56,189,248,0.26),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.18),transparent_55%)]"
      : tone === "violet"
        ? "bg-[radial-gradient(circle_at_30%_25%,rgba(168,85,247,0.24),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.16),transparent_55%)]"
        : tone === "emerald"
          ? "bg-[radial-gradient(circle_at_30%_25%,rgba(16,185,129,0.22),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(34,197,94,0.16),transparent_55%)]"
          : tone === "amber"
            ? "bg-[radial-gradient(circle_at_30%_25%,rgba(245,158,11,0.22),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(234,179,8,0.16),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_30%_25%,rgba(148,163,184,0.18),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.12),transparent_55%)]";

  return (
    <span
      className={
        "group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl " +
        "border border-white/12 bg-white/8 backdrop-blur " +
        "shadow-[0_14px_40px_rgba(0,0,0,0.35)] " +
        "transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
      }
    >
      <span className={"absolute inset-0 " + bg} />
      <span className="absolute inset-0 bg-gradient-to-br from-white/18 via-white/6 to-transparent" />
      <span className="absolute inset-0 ring-1 ring-white/10" />
      <span className="relative text-white/95 [&>svg]:h-6 [&>svg]:w-6">{children}</span>
    </span>
  );
}
