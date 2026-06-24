import React from "react";
import { AboutContent } from "@/components/sections/about-content";
import { SECTION_PANEL } from "@/lib/styles";

export function AboutSection() {
  return (
    <section id="about" className={`mt-10 ${SECTION_PANEL}`}>
      <AboutContent />
    </section>
  );
}
