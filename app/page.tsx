"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

const LINKS = {
  github: "https://github.com/ShohamLi",
  linkedin: "https://www.linkedin.com/in/shoham-liebermann-21a544314/",
  email: "mailto:shoham183@gmail.com",
  resume: "/Shoham_Liebermann_CV.pdf",
};

const ROLE_WISHLIST = ["Backend", "Frontend", "Full-Stack", "Data Science"];

type Project = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  logo: ReactNode;
};

type SkillCategory = "All" | "Languages" | "Frameworks" | "Tools" | "OS" | "Data & ML";

type Skill = {
  name: string;
  category: Exclude<SkillCategory, "All">;
  icon: ReactNode;
};

/* -------------------- Social icons -------------------- */

function IconGitHub({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 .5C5.73.5.75 5.77.75 12.26c0 5.2 3.44 9.6 8.2 11.16.6.12.82-.27.82-.58v-2.1c-3.34.75-4.04-1.66-4.04-1.66-.55-1.43-1.34-1.82-1.34-1.82-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.29 1.86 1.29 1.08 1.9 2.83 1.35 3.52 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.46-1.37-5.46-6.1 0-1.35.46-2.46 1.22-3.33-.12-.31-.53-1.58.12-3.29 0 0 1.01-.33 3.3 1.27a11.1 11.1 0 0 1 3.01-.42c1.02 0 2.05.14 3.01.42 2.29-1.6 3.3-1.27 3.3-1.27.65 1.71.24 2.98.12 3.29.76.87 1.22 1.98 1.22 3.33 0 4.75-2.8 5.78-5.47 6.09.43.38.82 1.13.82 2.28v3.37c0 .31.22.7.83.58 4.76-1.56 8.2-5.96 8.2-11.16C23.25 5.77 18.27.5 12 .5z" />
    </svg>
  );
}

function IconLinkedIn({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 23.5h4V7.98h-4V23.5zM8 7.98h3.83v2.12h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.25c0-1.97-.04-4.5-2.74-4.5-2.74 0-3.16 2.14-3.16 4.36v8.39H8V7.98z" />
    </svg>
  );
}

function IconMail({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

/* -------------------- CV icon -------------------- */

function IconCV({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M7 2.8h7.6L19.2 7v14.2c0 1-.8 1.8-1.8 1.8H7c-1 0-1.8-.8-1.8-1.8V4.6c0-1 .8-1.8 1.8-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d="M14.6 2.8V7H19.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" opacity="0.9" />
      <path
        d="M10.7 9.2 8.7 13.2h2.1l-1.4 3.6 4-4.8h-2.1l1.4-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M7.8 19.2h8.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

/* -------------------- Project logos -------------------- */

function IconSpine({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 2c2.2 0 4 1.8 4 4 0 .7-.2 1.4-.5 2 .3.6.5 1.3.5 2 0 .8-.2 1.5-.6 2.1.4.6.6 1.3.6 2.1 0 .7-.2 1.4-.5 2 .3.6.5 1.3.5 2 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-.7.2-1.4.5-2-.3-.6-.5-1.3-.5-2 0-.8.2-1.5.6-2.1-.4-.6-.6-1.3-.6-2.1 0-.7.2-1.4.5-2-.3-.6-.5-1.3-.5-2 0-2.2 1.8-4 4-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function IconApi({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M8 8 4 12l4 4M16 8l4 4-4 4M14 6 10 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

/* -------------------- Skill LogoBox (pretty) -------------------- */

const CATEGORY_TONE: Record<Exclude<SkillCategory, "All">, "sky" | "violet" | "emerald" | "amber" | "slate"> = {
  Languages: "sky",
  Frameworks: "violet",
  "Data & ML": "emerald",
  Tools: "amber",
  OS: "slate",
};

function LogoBox({
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

/* -------------------- Skill icons -------------------- */

function IconPython({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 3.2c-3.3 0-4.7 1.2-4.7 3.6v2.2h6.7c1.6 0 2.8 1.1 2.8 2.6v.4c0 1.5-1.2 2.6-2.8 2.6H9.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M12 20.8c3.3 0 4.7-1.2 4.7-3.6V15h-6.7c-1.6 0-2.8-1.1-2.8-2.6V12c0-1.5 1.2-2.6 2.8-2.6H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="10.1" cy="6.6" r="0.8" fill="currentColor" opacity="0.9" />
      <circle cx="13.9" cy="17.4" r="0.8" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function IconJavaLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M7 10.5h9.5v4.2c0 2-1.7 3.6-3.7 3.6H10.7C8.7 18.3 7 16.7 7 14.7v-4.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M16.6 11.2h1.1c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3h-1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path d="M8.1 20h9.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
      <path
        d="M10 6.2c.8.6.8 1.1 0 1.7s-.8 1.1 0 1.7M13 6c.8.6.8 1.1 0 1.7s-.8 1.1 0 1.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function IconC({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M12 3.6a8.4 8.4 0 1 0 0 16.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M12 6.4a5.6 5.6 0 1 0 0 11.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function IconSQL({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <ellipse cx="12" cy="6.5" rx="6.6" ry="2.7" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path d="M5.4 6.5v10.2c0 1.5 3 2.7 6.6 2.7s6.6-1.2 6.6-2.7V6.5" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path d="M5.4 11.1c0 1.5 3 2.7 6.6 2.7s6.6-1.2 6.6-2.7" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    </svg>
  );
}

function IconASM({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path
        d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function IconJS({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path d="M11 9 8.2 12 11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M13 9 15.8 12 13 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function IconNext({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path d="M8 16V8l8 8V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
}

function IconReact({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.9" />
      <path d="M12 4.2c4.7 0 8.5 3.5 8.5 7.8S16.7 19.8 12 19.8 3.5 16.3 3.5 12 7.3 4.2 12 4.2Z" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M6.2 7.2c2.3-4.1 7-5.5 10.4-3.4s4.3 6.8 2 10.9-7 5.5-10.4 3.4-4.3-6.8-2-10.9Z" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M6.2 16.8c-2.3-4.1-.9-8.8 2.5-10.9s8.1-.7 10.4 3.4.9 8.8-2.5 10.9-8.1.7-10.4-3.4Z" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}

function IconTailwind({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M6 12.4c1.2-1.8 2.7-2.7 4.5-2.7 2.7 0 3.3 2 4.6 2 1 0 1.9-.5 2.9-1.6-1.2 1.8-2.7 2.7-4.5 2.7-2.7 0-3.3-2-4.6-2-1 0-1.9.5-2.9 1.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M6 16.4c1.2-1.8 2.7-2.7 4.5-2.7 2.7 0 3.3 2 4.6 2 1 0 1.9-.5 2.9-1.6-1.2 1.8-2.7 2.7-4.5 2.7-2.7 0-3.3-2-4.6-2-1 0-1.9.5-2.9 1.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

function IconFramer({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IconPandas({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M7 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      <path d="M17 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function IconNumPy({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M12 4 19 8v8l-7 4-7-4V8l7-4Z" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />
      <path d="M12 4v8l7 4" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <path d="M12 12 5 16" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    </svg>
  );
}

function IconSklearn({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <circle cx="16.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <circle cx="7.5" cy="16" r="2" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <path d="M9 8.5 15 7.8M8.5 9.8 8 14M15.5 9 16 14.6M9.2 16 14.4 16.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function IconTensor({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="6" y="6" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <rect x="13" y="6" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <rect x="9.5" y="13" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <path d="M11 8.5h2M10.5 11v2M13.5 11v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function IconKeras({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />
      <circle cx="7" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />
      <circle cx="7" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />
      <circle cx="17" cy="9.5" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <circle cx="17" cy="14.5" r="1.8" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <path d="M8.7 7.4 15.2 9M8.7 12 15.2 12M8.7 16.6 15.2 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function IconJupyter({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M6.2 12a5.8 5.8 0 0 1 11.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <path d="M17.8 12a5.8 5.8 0 0 1-11.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      <circle cx="7.2" cy="6.7" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="16.8" cy="17.3" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="17.2" cy="6.9" r="0.9" fill="currentColor" opacity="0.55" />
      <circle cx="6.8" cy="17.1" r="0.9" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function IconColab({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M8.5 17.2h9a3.2 3.2 0 0 0 .2-6.4 4.3 4.3 0 0 0-8.2-1.4A3.2 3.2 0 0 0 8.5 17.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d="M9.4 12.2 7.8 13.8l1.6 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      <path d="M14.6 12.2 16.2 13.8l-1.6 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
}

function IconGitBranch({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M7 4.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm0 0v9.2c0 2.2 1.8 4 4 4h1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M17 14.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm0 0V11c0-2.2-1.8-4-4-4h-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

function IconVSCodeLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M16.8 2.6 22 5.2v13.6l-5.2 2.6-9.4-8.1 3.2-2.7 6.2 5.1V7.3l-6.2 5.1-3.2-2.7 9.4-7.1Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M8.6 9.8 6 7.7 3.2 10.1c-.6.5-.6 1.4 0 1.9l2.8 2.4 2.6-2.1"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function IconVMware({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="6" y="7" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" opacity="0.9" />
      <rect x="10" y="9" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" opacity="0.55" />
    </svg>
  );
}

function IconOpenGL({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M12 5 19 18H5L12 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" opacity="0.9" />
      <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    </svg>
  );
}

function IconVercel({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 5 21 19H3L12 5Z" opacity="0.9" />
    </svg>
  );
}

function IconWindowsLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M2.2 3.2h9.2v8.2H2.2V3.2Zm10.4 0h9.2v8.2h-9.2V3.2ZM2.2 12.6h9.2v8.2H2.2v-8.2Zm10.4 0h9.2v8.2h-9.2v-8.2Z" />
    </svg>
  );
}

function IconLinux({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 4.2c2.1 0 3.6 1.7 3.6 4 0 1.1-.3 2-.8 2.7.9 1 1.4 2.3 1.4 3.9 0 3-1.8 5-4.2 5s-4.2-2-4.2-5c0-1.6.5-2.9 1.4-3.9-.5-.7-.8-1.6-.8-2.7 0-2.3 1.5-4 3.6-4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        opacity="0.9"
      />
      <path d="M9.7 14.3c.7.6 1.5.9 2.3.9s1.6-.3 2.3-.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <circle cx="10.7" cy="8.3" r="0.6" fill="currentColor" opacity="0.9" />
      <circle cx="13.3" cy="8.3" r="0.6" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function IconApple({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M15.2 7.2c.9-1.1 1.5-2.4 1.4-3.7-1.3.1-2.6.8-3.5 1.9-.8 1-.9 2-.8 3.1 1.1.1 2.1-.4 2.9-1.3Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M12 8.6c1.6 0 2.3-1 3.6-1 1.1 0 2.1.6 2.6 1.5-.6.4-1.6 1.1-1.6 2.5 0 1.6 1.2 2.5 1.8 2.8-.4 1.2-1.2 2.9-2.4 3.8-.9.7-1.7.8-2.4.8-.9 0-1.6-.3-2.4-.3-.8 0-1.5.3-2.5.3-.7 0-1.6-.1-2.5-1-1.5-1.5-2.6-4.4-2.6-6.8 0-2.3 1.4-3.6 3-3.6 1.2 0 2.2 1 3.4 1Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

/* -------------------- Data -------------------- */

const PROJECTS: Project[] = [
  {
    title: "Spinal Cobb Angle Regression",
    subtitle: "Deep Learning - Medical Imaging",
    description: "Predicting spinal Cobb angles (PT, MT, TL) from X-ray images with clean evaluation and reproducible experiments.",
    image: "/project-cobb.jpg",
    tags: ["Preprocessing", "EDA", "Deep Learning", "Explainability", "Google Colab", "Python"],
    githubUrl: "https://github.com/ShohamLi/spinal_cobb_project",
    logo: <IconSpine className="h-5 w-5" />,
  },
  {
    title: "Task Manager API",
    subtitle: "Backend - REST API",
    description: "Backend service for managing tasks with practical CRUD endpoints, clean structure, and predictable conventions.",
    image: "/project-api.jpg",
    tags: ["Backend", "REST API", "CRUD", "Git", "Testing", "Clean Architecture"],
    githubUrl: "https://github.com/ShohamLi/task-manager-api",
    logo: <IconApi className="h-5 w-5" />,
  },
];

const SKILLS: Skill[] = [
  { name: "Python", category: "Languages", icon: <IconPython /> },
  { name: "Java", category: "Languages", icon: <IconJavaLogo /> },
  { name: "C", category: "Languages", icon: <IconC /> },
  { name: "SQL", category: "Languages", icon: <IconSQL /> },
  { name: "Assembly", category: "Languages", icon: <IconASM /> },
  { name: "JavaScript", category: "Languages", icon: <IconJS /> },

  { name: "Next.js", category: "Frameworks", icon: <IconNext /> },
  { name: "React", category: "Frameworks", icon: <IconReact /> },
  { name: "Tailwind CSS", category: "Frameworks", icon: <IconTailwind /> },
  { name: "Framer Motion", category: "Frameworks", icon: <IconFramer /> },

  { name: "Pandas", category: "Data & ML", icon: <IconPandas /> },
  { name: "NumPy", category: "Data & ML", icon: <IconNumPy /> },
  { name: "scikit-learn", category: "Data & ML", icon: <IconSklearn /> },
  { name: "TensorFlow", category: "Data & ML", icon: <IconTensor /> },
  { name: "Keras", category: "Data & ML", icon: <IconKeras /> },
  { name: "Jupyter", category: "Data & ML", icon: <IconJupyter /> },
  { name: "Google Colab", category: "Data & ML", icon: <IconColab /> },

  { name: "Git", category: "Tools", icon: <IconGitBranch /> },
  { name: "GitHub", category: "Tools", icon: <IconGitHub /> },
  { name: "VS Code", category: "Tools", icon: <IconVSCodeLogo /> },
  { name: "VMware", category: "Tools", icon: <IconVMware /> },
  { name: "OpenGL", category: "Tools", icon: <IconOpenGL /> },
  { name: "Vercel", category: "Tools", icon: <IconVercel /> },

  { name: "Windows", category: "OS", icon: <IconWindowsLogo /> },
  { name: "Linux", category: "OS", icon: <IconLinux /> },
  { name: "macOS", category: "OS", icon: <IconApple /> },
];

/* -------------------- UI components -------------------- */

function NavLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon?: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/90"
    >
      {icon ? <span className="text-white/90">{icon}</span> : null}
      {label}
    </a>
  );
}

function ActionButton({
  href,
  onClick,
  icon,
  children,
  external,
}: {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium " +
    "border border-white/12 bg-[#141a3a]/70 text-white/90 backdrop-blur " +
    "focus:outline-none focus:ring-2 focus:ring-white/25";

  if (href) {
    const isExternal = external ?? (href.startsWith("http") || href.startsWith("mailto:"));
    return (
      <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className={cls}>
        {icon ? <span className="text-white/90">{icon}</span> : null}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon ? <span className="text-white/90">{icon}</span> : null}
      {children}
    </button>
  );
}

function SocialIconButton({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white/90 backdrop-blur"
    >
      {icon}
    </a>
  );
}

function RoleTile({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm text-white/85 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
      {label}
    </div>
  );
}

function TagSquare({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}

function SkillChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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

function SkillPill({ s }: { s: Skill }) {
  const tone = CATEGORY_TONE[s.category];
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur transition hover:border-white/18 hover:bg-white/10">
      <LogoBox tone={tone}>{s.icon}</LogoBox>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white/95 leading-tight">{s.name}</div>
        <div className="text-xs text-white/70">{s.category}</div>
      </div>
    </div>
  );
}

/* -------------------- Page -------------------- */

export default function Page() {
  const year = useMemo(() => new Date().getFullYear(), []);

  // contact form state
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  // skills filter
  const [skillFilter, setSkillFilter] = useState<SkillCategory>("All");
async function submitMail() {
  setStatus("idle");
  setStatusMsg("");

  if (!message.trim()) {
    setStatus("error");
    setStatusMsg("Please write a message first.");
    return;
  }

  setSending(true);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: fromEmail,
        message,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setStatusMsg(data?.error || "Failed to send. Please try again.");
      return;
    }

    setStatus("success");
    setStatusMsg("Message sent successfully. Thanks!");
    setName("");
    setFromEmail("");
    setMessage("");
  } catch {
    setStatus("error");
    setStatusMsg("Network error. Please try again.");
  } finally {
    setSending(false);
  }
}
  const visibleSkills = useMemo(() => {
    if (skillFilter === "All") return SKILLS;
    return SKILLS.filter((s) => s.category === skillFilter);
  }, [skillFilter]);

  return (
    <main className="min-h-screen text-white">
      {/* Base background */}
      <div className="pointer-events-none fixed inset-0 -z-50 bg-gradient-to-b from-[#06020d] via-[#07112a] to-[#03040a]" />

      {/* Subtle background image */}
      <div className="pointer-events-none fixed inset-0 -z-45">
        <Image src="/hero.jpg" alt="Background" fill priority className="object-cover opacity-[0.12] blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#03040a]/40 via-[#03040a]/25 to-[#03040a]/70" />
      </div>

      {/* Aurora */}
      <div className="pointer-events-none fixed inset-0 -z-40">
        <motion.div
          className="absolute -top-72 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.22), transparent 55%), radial-gradient(circle at 70% 40%, rgba(59,130,246,0.20), transparent 55%), radial-gradient(circle at 45% 70%, rgba(99,102,241,0.16), transparent 55%)",
          }}
          animate={{ y: [0, 22, 0], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-80 -left-80 h-[980px] w-[980px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(circle at 70% 60%, rgba(168,85,247,0.14), transparent 60%)",
          }}
          animate={{ x: [0, 26, 0], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03040a]/60 via-transparent to-[#03040a]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#03040a]/65" />
      </div>

      {/* Stars */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-30 opacity-[0.85]"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 12% 18%, rgba(255,255,255,0.95) 45%, transparent 55%),
            radial-gradient(1px 1px at 28% 74%, rgba(255,255,255,0.85) 50%, transparent 52%),
            radial-gradient(2px 2px at 68% 28%, rgba(255,255,255,0.90) 45%, transparent 55%),
            radial-gradient(1px 1px at 88% 58%, rgba(255,255,255,0.80) 50%, transparent 52%),
            radial-gradient(1px 1px at 42% 42%, rgba(255,255,255,0.70) 50%, transparent 52%),
            radial-gradient(1px 1px at 18% 64%, rgba(255,255,255,0.60) 50%, transparent 52%),
            radial-gradient(1px 1px at 74% 84%, rgba(255,255,255,0.55) 50%, transparent 52%),
            radial-gradient(1px 1px at 6% 92%, rgba(255,255,255,0.55) 50%, transparent 52%),
            radial-gradient(2px 2px at 24% 26%, rgba(180,215,255,0.65) 45%, transparent 55%),
            radial-gradient(2px 2px at 58% 70%, rgba(210,190,255,0.60) 45%, transparent 55%),
            radial-gradient(2px 2px at 82% 14%, rgba(190,255,230,0.50) 45%, transparent 55%)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "520px 520px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "260px 170px", "0px 0px"], opacity: [0.75, 0.92, 0.78] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* TOP NAV */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#03040a]/25 backdrop-blur">
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

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/10 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.60)]"
        >
          <div className="grid gap-10 p-7 md:grid-cols-12 md:p-10">
            {/* Left */}
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

            {/* Right (Hero image) - wider + taller */}
            <div className="md:col-span-5 md:flex md:justify-end">
              <div className="w-full max-w-none md:w-[520px] lg:w-[600px]">
                <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.50)]">
                  <div className="relative w-full aspect-[3/5]">
                    <Image
                      src="/hero.jpg"
                      alt="Shoham hero"
                      fill
                      priority
                      className="object-cover object-[50%_30%] scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/10" />
                    <div className="absolute inset-0 ring-1 ring-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ABOUT */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mt-10 rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        >
          <h2 className="text-2xl font-semibold">About</h2>

          <p className="mt-4 text-white/95 leading-relaxed">
            I am a 29 year old Computer Science graduate from The Open University of Israel. I completed my degree through a highly independent path,
            studying and progressing almost entirely on my own. That experience built strong discipline, consistency, and responsibility, and taught me
            how to learn quickly from documentation, experiments, and real feedback.
          </p>

          <p className="mt-4 text-white/95 leading-relaxed">
            I work well under pressure and stay focused in demanding situations. I prefer structured thinking, clear priorities, and practical execution.
            When something breaks, I debug systematically, isolate the cause, validate assumptions, and move forward with measurable improvements.
          </p>

          <p className="mt-4 text-white/95 leading-relaxed">
            I care about clean structure, reproducibility, and outcomes you can verify. I enjoy deep technical work, building projects end to end, and
            polishing details until the result is solid and professional. I am currently looking for a junior role where I can contribute immediately,
            learn fast, and grow into a strong engineer within a professional team.
          </p>
        </motion.section>

        {/* SKILLS */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mt-10 rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Skills</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Languages", "Frameworks", "Data & ML", "Tools", "OS"] as SkillCategory[]).map((c) => (
                <SkillChip key={c} active={skillFilter === c} onClick={() => setSkillFilter(c)}>
                  {c}
                </SkillChip>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSkills.map((s) => (
              <SkillPill key={s.name} s={s} />
            ))}
          </div>
        </motion.section>

        {/* PROJECTS */}
        <section id="projects" className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <span className="text-sm text-white/85">Selected work ({PROJECTS.length})</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PROJECTS.map((p, idx) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: "easeOut", delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="overflow-hidden rounded-[28px] border border-white/12 bg-white/10 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image src={p.image} alt={p.title} fill className="object-cover" priority={idx === 0} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
                  <div className="absolute inset-0 ring-1 ring-white/10" />

                  <div className="absolute left-4 top-4 inline-flex items-center justify-center rounded-2xl border border-white/12 bg-[#03040a]/35 p-3 text-white/90 backdrop-blur">
                    {p.logo}
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
                    <ActionButton href={p.githubUrl} icon={<IconGitHub />} external>
                      Code →
                    </ActionButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
{/* CONTACT */}
<motion.section
  id="contact"
  initial={{ opacity: 0, y: 14 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{ duration: 0.65, ease: "easeOut" }}
  className="mt-10"
>
  <div className="mb-4 flex items-end justify-between">
    <h2 className="text-2xl font-semibold">Contact</h2>
    <span className="text-sm text-white/85">Get in touch</span>
  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
    {/* Left: contact form */}
    <div className="md:col-span-7 rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <h3 className="text-xl font-normal">Send a message</h3>

      <div className="mt-6 grid gap-4">
        {/* Name */}
        <div className="grid gap-2">
          <label className="text-xs text-white/70">Name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setStatusMsg("");
              }
            }}
            className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <label className="text-xs text-white/70">Email</label>
          <input
            value={fromEmail}
            onChange={(e) => {
              setFromEmail(e.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setStatusMsg("");
              }
            }}
            className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25"
            placeholder="your@email.com"
          />
        </div>

        {/* Message */}
        <div className="grid gap-2">
          <label className="text-xs text-white/70">Message</label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setStatusMsg("");
              }
            }}
            className="min-h-[140px] w-full resize-none rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25"
            placeholder="Write your message..."
          />
        </div>

        {/* Button */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ActionButton onClick={submitMail} icon={<IconMail />}>
            {sending ? "Sending..." : "Send message"}
          </ActionButton>
        </div>

        {/* Status */}
        {status !== "idle" ? (
          <div
            className={
              "mt-4 rounded-2xl border p-4 text-sm backdrop-blur " +
              (status === "success"
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                : "border-rose-400/25 bg-rose-400/10 text-rose-100")
            }
          >
            {statusMsg}
          </div>
        ) : null}
      </div>
    </div>

    {/* Right: details */}
    <div className="md:col-span-5 rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <h3 className="text-xl font-semibold">Get in touch</h3>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Email</div>
          <div className="mt-1 flex items-center gap-2 text-white/95">
            <IconMail className="h-4 w-4" />
            shoham183@gmail.com
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Location</div>
          <div className="mt-1 text-white/95">Israel</div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Links</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <ActionButton href={LINKS.github} icon={<IconGitHub />} external>
              GitHub
            </ActionButton>
            <ActionButton href={LINKS.linkedin} icon={<IconLinkedIn />} external>
              LinkedIn
            </ActionButton>
            <ActionButton href={LINKS.resume} icon={<IconCV />} external>
              CV
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.section>

<footer className="mt-12 pb-6 text-center text-xs text-white/80">
  © {year} Shoham Liebermann - Built with Next.js + Tailwind
</footer>
</div>
</main>
);
}
