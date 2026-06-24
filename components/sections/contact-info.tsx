import React from "react";
import { IconCV, IconGitHub, IconLinkedIn, IconMail } from "@/components/icons";
import { ActionLink } from "@/components/ui/nav";
import { LINKS } from "@/lib/constants";
import { CONTACT_PANEL } from "@/lib/styles";

/** Server Component — static contact details, no client JavaScript required */

export function ContactInfo() {
  return (
    <div className={`min-w-0 ${CONTACT_PANEL}`}>
      <h3 className="text-xl font-semibold">Get in touch</h3>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Email</div>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-white/95">
            <IconMail className="h-4 w-4 shrink-0" />
            <span className="min-w-0 [overflow-wrap:anywhere]">shoham183@gmail.com</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Location</div>
          <div className="mt-1 text-white/95">Israel</div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
          <div className="text-xs text-white/70">Links</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap [&>a]:w-full sm:[&>a]:w-auto">
            <ActionLink href={LINKS.github} icon={<IconGitHub />} external>
              GitHub
            </ActionLink>
            <ActionLink href={LINKS.linkedin} icon={<IconLinkedIn />} external>
              LinkedIn
            </ActionLink>
            <ActionLink href={LINKS.resume} icon={<IconCV />} external>
              CV
            </ActionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
