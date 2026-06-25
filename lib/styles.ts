/** Shared Tailwind class strings — single source of truth for repeated section styles */

export const SECTION_PANEL =
  "rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]";

export const CONTACT_PANEL =
  "h-full rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-7";

export const HERO_PANEL =
  "relative overflow-hidden rounded-[36px] border border-white/12 bg-white/10 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.60)]";

export const INPUT_FIELD =
  "w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/25";

/** Contact form status messages — same box model as INPUT_FIELD, colors vary by state */
export const FORM_MESSAGE_BASE =
  "mt-2 w-fit max-w-full rounded-2xl border px-4 py-3 text-sm leading-normal";

export const FORM_MESSAGE_SUCCESS =
  `${FORM_MESSAGE_BASE} border-emerald-400/10 bg-emerald-400/5 text-emerald-200/85`;

export const FORM_MESSAGE_ERROR =
  `${FORM_MESSAGE_BASE} border-rose-400/25 bg-rose-400/10 text-rose-100`;

export const PROJECT_CARD =
  "project-card overflow-hidden rounded-[28px] border border-white/12 bg-white/10 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]";
