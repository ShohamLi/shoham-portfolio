"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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

function IconGitHub({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 .5C5.73.5.75 5.77.75 12.26c0 5.2 3.44 9.6 8.2 11.16.6.12.82-.27.82-.58v-2.1c-3.34.75-4.04-1.66-4.04-1.66-.55-1.43-1.34-1.82-1.34-1.82-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.29 1.86 1.29 1.08 1.9 2.83 1.35 3.52 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.46-1.37-5.46-6.1 0-1.35.46-2.46 1.22-3.33-.12-.31-.53-1.58.12-3.29 0 0 1.01-.33 3.3 1.27a11.1 11.1 0 0 1 3.01-.42c1.02 0 2.05.14 3.01.42 2.29-1.6 3.3-1.27 3.3-1.27.65 1.71.24 2.98.12 3.29.76.87 1.22 1.98 1.22 3.33 0 4.75-2.8 5.78-5.47 6.09.43.38.82 1.13.82 2.28v3.37c0 .31.22.7.83.58 4.76-1.56 8.2-5.96 8.2-11.16C23.25 5.77 18.27.5 12 .5z" />
    </svg>
  );
}

function IconLinkedIn({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 23.5h4V7.98h-4V23.5zM8 7.98h3.83v2.12h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.25c0-1.97-.04-4.5-2.74-4.5-2.74 0-3.16 2.14-3.16 4.36v8.39H8V7.98z" />
    </svg>
  );
}

function IconMail({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

function IconSpine({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 2c2.2 0 4 1.8 4 4 0 .7-.2 1.4-.5 2 .3.6.5 1.3.5 2 0 .8-.2 1.5-.6 2.1.4.6.6 1.3.6 2.1 0 .7-.2 1.4-.5 2 .3.6.5 1.3.5 2 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-.7.2-1.4.5-2-.3-.6-.5-1.3-.5-2 0-.8.2-1.5.6-2.1-.4-.6-.6-1.3-.6-2.1 0-.7.2-1.4.5-2-.3-.6-.5-1.3-.5-2 0-2.2 1.8-4 4-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path
        d="M10 6h4M10 10h4M10 14h4M10 18h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
      />
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

const PROJECTS: Project[] = [
  {
    title: "Spinal Cobb Angle Regression",
    subtitle: "Deep Learning - Medical Imaging",
    description:
      "Predicting spinal Cobb angles (PT, MT, TL) from X-ray images with clean evaluation and reproducible experiments.",
    image: "/project-cobb.jpg",
    tags: [
      "Preprocessing",
      "EDA",
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Explainability",
      "Google Colab",
      "Python",
    ],
    githubUrl: "https://github.com/ShohamLi/spinal_cobb_project",
    logo: <IconSpine className="h-5 w-5" />,
  },
  {
    title: "Task Manager API",
    subtitle: "Backend - REST API",
    description:
      "Backend service for managing tasks with practical CRUD endpoints, clean structure, and predictable conventions.",
    image: "/project-api.jpg",
    tags: ["Backend", "REST API", "CRUD", "Git", "Testing", "Clean Architecture"],
    githubUrl: "https://github.com/ShohamLi/task-manager-api",
    logo: <IconApi className="h-5 w-5" />,
  },
];

function NavLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/15 transition"
    >
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
    "hover:bg-[#1a2250]/75 transition focus:outline-none focus:ring-2 focus:ring-white/25";

  if (href) {
    const isExternal = external ?? (href.startsWith("http") || href.startsWith("mailto:"));
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={cls}
      >
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

function SocialIconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white/90 backdrop-blur hover:bg-white/15 transition"
    >
      {icon}
    </a>
  );
}

function RoleTile({ label, active }: { label: string; active: boolean }) {
  return (
    <motion.div
      className={
        "rounded-2xl border px-4 py-3 text-sm backdrop-blur select-none " +
        (active
          ? "border-white/30 bg-white/16 text-white shadow-[0_10px_35px_rgba(168,85,247,0.18)]"
          : "border-white/12 bg-white/8 text-white/85")
      }
      animate={active ? { y: [0, -2, 0], opacity: [0.95, 1, 0.95] } : { opacity: 0.9 }}
      transition={active ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    >
      {label}
    </motion.div>
  );
}

function TagSquare({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-xs text-white/90 backdrop-blur">
      {children}
    </span>
  );
}

export default function Page() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLE_WISHLIST.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");

  function submitMail() {
    const subject = encodeURIComponent(`Portfolio message from ${name || "Someone"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${fromEmail}\n\nMessage:\n${message}\n`);
    window.location.href = `mailto:shoham183@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen text-white">
      {/* Base background: purple + blue + black */}
      <div className="pointer-events-none fixed inset-0 -z-50 bg-gradient-to-b from-[#06020d] via-[#07112a] to-[#03040a]" />

      {/* Subtle hero background image (keeps the site background, adds your vibe) */}
      <div className="pointer-events-none fixed inset-0 -z-45">
        <Image
          src="/hero.jpg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-[0.12] blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#03040a]/40 via-[#03040a]/25 to-[#03040a]/70" />
      </div>

      {/* Aurora color pepper */}
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

      {/* Stars always moving */}
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
        animate={{
          backgroundPosition: ["0px 0px", "260px 170px", "0px 0px"],
          opacity: [0.75, 0.92, 0.78],
        }}
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
            <NavLink href="#projects" label="Projects" />
            <NavLink href="#contact" label="Contact" />
            <NavLink href={LINKS.resume} label="Resume" external />
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
            <div className="md:col-span-6">
              <h1 className="mt-1 text-5xl font-semibold tracking-tight leading-[1.03] text-white">
                Software Engineer
              </h1>

              <p className="mt-3 text-lg text-white/90">Computer Science Graduate</p>

              {/* Roles switching squares */}
              <div className="mt-6">
                <div className="text-xs text-white/70">Target roles</div>
                <div className="mt-3 grid max-w-sm grid-cols-2 gap-3">
                  {ROLE_WISHLIST.map((r, i) => (
                    <RoleTile key={r} label={r} active={i === roleIdx} />
                  ))}
                </div>
              </div>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                <SocialIconButton href={LINKS.github} label="GitHub" icon={<IconGitHub />} />
                <SocialIconButton href={LINKS.linkedin} label="LinkedIn" icon={<IconLinkedIn />} />
                <SocialIconButton href={LINKS.email} label="Email" icon={<IconMail />} />
              </div>
            </div>

            {/* Right: square image that shows FULL photo (no crop) */}
            <div className="md:col-span-6">
              <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.50)]">
                <div className="relative w-full aspect-square">
                  {/* background fill (blurred) */}
                  <Image
                    src="/hero.jpg"
                    alt=""
                    fill
                    className="object-cover scale-110 blur-[14px] opacity-[0.55]"
                  />

                  {/* main image (FULL visible) */}
                  <Image
                    src="/hero.jpg"
                    alt="Shoham hero"
                    fill
                    priority
                    className="object-contain p-6"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10" />
                  <div className="absolute inset-0 ring-1 ring-white/10" />
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
            I am a 29 year old Computer Science graduate from The Open University of Israel. I completed my degree
            through a highly independent path, studying and progressing almost entirely on my own. That experience
            built strong discipline, consistency, and responsibility, and taught me how to learn quickly from
            documentation, experiments, and real feedback.
          </p>

          <p className="mt-4 text-white/95 leading-relaxed">
            I work well under pressure and stay focused in demanding situations. I prefer structured thinking,
            clear priorities, and practical execution. When something breaks, I debug systematically, isolate the
            cause, validate assumptions, and move forward with measurable improvements.
          </p>

          <p className="mt-4 text-white/95 leading-relaxed">
            I care about clean structure, reproducibility, and outcomes you can verify. I enjoy deep technical work,
            building projects end to end, and polishing details until the result is solid and professional. I am
            currently looking for a junior role where I can contribute immediately, learn fast, and grow into a
            strong engineer within a professional team.
          </p>
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
            <div className="md:col-span-7 rounded-[28px] border border-white/12 bg-white/10 p-7 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <h3 className="text-xl font-normal">Send a message</h3>
              <p className="mt-2 text-white/90">This form opens your email client with the message.</p>

              <div className="mt-5 space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none focus:border-white/25"
                />
                <input
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none focus:border-white/25"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  rows={5}
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none focus:border-white/25"
                />
              </div>

              <div className="mt-5">
                <ActionButton onClick={submitMail} icon={<IconMail />}>
                  Send Message
                </ActionButton>
              </div>
            </div>

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
                    <ActionButton href={LINKS.resume} external>
                      Resume
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
