import { CONTACT_PANEL, INPUT_FIELD } from "@/lib/styles";

/** Server-rendered contact form placeholder — shown until client island loads */

export function ContactFormStatic() {
  return (
    <div className="h-full min-w-0">
      <div className={CONTACT_PANEL} aria-hidden="true">
        <h3 className="text-xl font-normal">Send a message</h3>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <div className="text-xs text-white/70">Name</div>
            <div className={`${INPUT_FIELD} h-[46px] opacity-60`} />
          </div>
          <div className="grid gap-2">
            <div className="text-xs text-white/70">Email</div>
            <div className={`${INPUT_FIELD} h-[46px] opacity-60`} />
          </div>
          <div className="grid gap-2">
            <div className="text-xs text-white/70">Message</div>
            <div className={`min-h-[140px] ${INPUT_FIELD} opacity-60`} />
          </div>
        </div>
      </div>
    </div>
  );
}
