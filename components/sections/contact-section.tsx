import React from "react";
import { ContactFormDeferred } from "@/components/sections/deferred-islands";
import { ContactFormStatic } from "@/components/sections/contact-form-static";
import { ContactInfo } from "@/components/sections/contact-info";

export function ContactSection() {
  return (
    <section id="contact" className="relative isolate mx-auto mt-10 w-full max-w-6xl">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-b from-[#07112a]/90 to-[#03040a]/95"
        aria-hidden="true"
      />
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <span className="text-sm text-white/85">Get in touch</span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,5fr)]">
        <ContactFormDeferred>
          <ContactFormStatic />
        </ContactFormDeferred>
        <ContactInfo />
      </div>
    </section>
  );
}
