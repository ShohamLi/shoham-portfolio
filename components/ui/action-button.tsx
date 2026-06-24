"use client";

import type { ReactNode } from "react";

export function ActionButton({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium " +
        "border border-white/12 bg-[#141a3a]/70 text-white/90 backdrop-blur " +
        "focus:outline-none focus:ring-2 focus:ring-white/25"
      }
    >
      {icon ? <span className="text-white/90">{icon}</span> : null}
      {children}
    </button>
  );
}
