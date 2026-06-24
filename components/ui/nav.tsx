import type { ReactNode } from "react";

const ACTION_LINK_CLS =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium " +
  "border border-white/12 bg-[#141a3a]/70 text-white/90 backdrop-blur " +
  "focus:outline-none focus:ring-2 focus:ring-white/25";

export function NavLink({
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

export function ActionLink({
  href,
  icon,
  children,
  external,
}: {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  external?: boolean;
}) {
  const isExternal = external ?? (href.startsWith("http") || href.startsWith("mailto:"));
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={ACTION_LINK_CLS}
    >
      {icon ? <span className="text-white/90">{icon}</span> : null}
      {children}
    </a>
  );
}

export function SocialIconButton({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
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

export function RoleTile({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm text-white/85 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
      {label}
    </div>
  );
}

export function TagSquare({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}
