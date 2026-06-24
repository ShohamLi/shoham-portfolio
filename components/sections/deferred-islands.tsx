"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const SkillsSection = dynamic(
  () => import("@/components/sections/skills-section").then((m) => ({ default: m.SkillsSection })),
  { ssr: false },
);

const ContactForm = dynamic(
  () => import("@/components/sections/contact-form").then((m) => ({ default: m.ContactForm })),
  { ssr: false },
);

function useNearViewport(rootMargin: string) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const mount = () => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            observer?.disconnect();
            setReady(true);
          }
        },
        { rootMargin },
      );
      observer.observe(el);
    };

    let idleId = 0;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(mount, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(mount, 1);
    }

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      observer?.disconnect();
    };
  }, [rootMargin]);

  return { ready, ref };
}

export function SkillsSectionDeferred({ children }: { children: ReactNode }) {
  const { ready, ref } = useNearViewport("0px");
  return <div ref={ref}>{ready ? <SkillsSection /> : children}</div>;
}

export function ContactFormDeferred({ children }: { children: ReactNode }) {
  const { ready, ref } = useNearViewport("0px");
  return (
    <div ref={ref} className="h-full min-w-0">
      {ready ? <ContactForm /> : children}
    </div>
  );
}
