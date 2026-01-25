type Project = {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tech: string[];
  links: { github?: string; report?: string; demo?: string };
};

export default function Home() {
  const contact = {
    name: "Shoham Liebermann",
    title: "Software Engineer (B.Sc. Computer Science)",
    tagline:
      "I build practical projects across ML, backend systems, and low-level analysis. I care about clean structure, reproducibility, and measurable results.",
    location: "Israel",
    github: "https://github.com/ShohamLi",
    linkedin: "https://www.linkedin.com/in/shoham-liebermann-21a544314",
    email: "shoham183@gmail.com",
    resumePath: "/Shoham_Liebermann_CV.pdf", // שים PDF בתיקיית public בשם הזה
  };

  const projects: Project[] = [
    {
      title: "Spinal Cobb Angle Regression",
      subtitle: "Deep Learning • Medical Imaging",
      description:
        "Deep learning pipeline that predicts PT/MT/TL Cobb angles from X-ray images, with an emphasis on reproducibility and robust evaluation.",
      highlights: [
        "End-to-end pipeline: preprocessing → training → evaluation",
        "Reproducible runs (consistent seeds, clean structure)",
        "Well-documented repo and clear results reporting",
      ],
      tech: ["Python", "Deep Learning", "Computer Vision"],
      links: {
        github: "https://github.com/ShohamLi/spinal_cobb_project",
      },
    },
    {
      title: "Olist E-Commerce",
      subtitle: "Data Science • ML • Analytics",
      description:
        "End-to-end analytics and modeling on Brazilian e-commerce data, exploring delivery delays and customer experience with actionable insights.",
      highlights: [
        "Merged multiple relational tables and engineered features",
        "EDA that ties operational metrics to customer outcomes",
        "Built predictive baselines aligned with business questions",
      ],
      tech: ["Data Science", "ML", "EDA", "Modeling"],
      links: {
        // אם יש לך repo או notebook ציבורי, שים פה
        github: "",
        report: "",
      },
    },
    {
      title: "CTF Reverse Engineering Challenge",
      subtitle: "Windows • Reverse Engineering",
      description:
        "Static + dynamic analysis of a Windows loader: derived XOR key behavior, validated execution flow, and confirmed payload behavior.",
      highlights: [
        "Clear methodology: static analysis + runtime validation",
        "Validated no unexpected side effects beyond intended flow",
        "Wrote a structured explanation/report of the solution",
      ],
      tech: ["Reverse Engineering", "Windows", "Ghidra"],
      links: {
        // אם יש report pdf/drive/notion - שים פה
        report: "",
      },
    },
    {
      title: "Task Manager API",
      subtitle: "Backend • REST API",
      description:
        "A backend API project demonstrating clean structure, CRUD endpoints, and practical API design for a task manager service.",
      highlights: [
        "CRUD endpoints with clean structure and readability",
        "Practical API design and maintainable codebase",
        "Versioned repo with clear commits",
      ],
      tech: ["API", "Backend", "Git"],
      links: {
        github: "https://github.com/ShohamLi/task-manager-api",
      },
    },
  ];

  const skills = [
    "Python",
    "Java",
    "SQL",
    "Git",
    "Linux/Windows",
    "Machine Learning",
    "Deep Learning",
    "REST APIs",
    "Debugging",
    "OS fundamentals",
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* HERO */}
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm text-zinc-300">{contact.title}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                {contact.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-zinc-200">
                {contact.tagline}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {contact.location}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Open to Junior Roles
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Full-time / Hybrid
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                href={contact.resumePath}
                target="_blank"
                rel="noreferrer"
              >
                Download Resume (PDF)
              </a>

              <div className="flex flex-wrap gap-2">
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  href={`mailto:${contact.email}`}
                >
                  Email
                </a>
              </div>

              <p className="text-xs text-zinc-400">
                Resume file should be in <span className="font-mono">/public</span> as{" "}
                <span className="font-mono">Shoham_Liebermann_CV.pdf</span>
              </p>
            </div>
          </div>
        </header>

        {/* PROJECTS */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Selected work with clear goals, methodology, and results.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <article
                key={p.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm transition-colors hover:bg-white/10"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-zinc-300">{p.subtitle}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-200">
                  {p.description}
                </p>

                <div className="mt-5">
                  <p className="text-xs font-medium text-zinc-300">Highlights</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                    {p.highlights.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {p.links.github ? (
                    <a
                      className="text-sm underline underline-offset-4 text-zinc-100 hover:text-white"
                      href={p.links.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-400">GitHub soon</span>
                  )}

                  {p.links.report ? (
                    <a
                      className="text-sm underline underline-offset-4 text-zinc-100 hover:text-white"
                      href={p.links.report}
                      target="_blank"
                      rel="noreferrer"
                    >
                     Report
                    </a>
                  ) : null}

                  {p.links.demo ? (
                    <a
                      className="text-sm underline underline-offset-4 text-zinc-100 hover:text-white"
                      href={p.links.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                     Demo
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Tools and topics I can explain and defend in an interview.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-100"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 pb-4 text-sm text-zinc-400">
          © {new Date().getFullYear()} {contact.name}. Built with Next.js.
        </footer>
      </div>
    </main>
  );
}
