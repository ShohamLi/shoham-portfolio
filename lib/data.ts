import type { Project, Skill } from "./types";

export const PROJECTS: Project[] = [
  {
    title: "Spinal Cobb Angle Regression",
    subtitle: "Deep Learning • Medical Imaging",
    description:
      "Multi-input deep learning model combining X-ray images, segmentation masks, and geometric features for Cobb angle regression, achieving a 2.78° test MAE.",
    image: "/project-cobb.webp",
    tags: ["TensorFlow", "OpenCV", "Python", "Deep Learning", "Regression"],
    githubUrl: "https://github.com/ShohamLi/spinal_cobb_project",
    logoIcon: "spine",
  },
  {
    title: "Jones Automation Upgrade",
    subtitle: "Automation • Playwright • LLM Integration",
    description:
      "Built a Playwright automation flow that fills and validates a live web form, captures a pre-submit screenshot, submits the form, and verifies successful navigation to the thank-you page. Extended the automation with an LLM-based input layer, allowing structured form data to be generated from natural-language scenarios instead of hardcoded values, making the flow more flexible, reusable, and closer to real QA automation workflows.",
    image: "/Automation.jpg",
    tags: ["Playwright", "JavaScript", "Node.js", "OpenAI", "Automation"],
    githubUrl: "https://github.com/ShohamLi/jones_exercise_shoham_upgrade",
    logoIcon: "api",
  },
  {
    title: "Bitwise Engine",
    subtitle: "Compiler Design • Expression Evaluation",
    description:
      "Built a reusable Python expression engine that compiles expressions once through tokenization, parsing, and validation, then evaluates immutable compiled expressions efficiently across repeated runs. The project focuses on compiler-design fundamentals, including lexical analysis, AST construction, operator precedence, validation, error handling, and safe expression execution without using Python eval.",
    image: "/Bitwise Engine.jpg",
    tags: ["Python", "Parser", "AST", "Validation", "Pytest"],
    githubUrl: "https://github.com/ShohamLi/expression-evaluation-engine",
    logoIcon: "asm",
  },
];

export const SKILLS: Skill[] = [
  { name: "Python", category: "Programming Languages", icon: "python" },
  { name: "JavaScript", category: "Programming Languages", icon: "js" },
  { name: "TypeScript", category: "Programming Languages", icon: "js" },
  { name: "Java", category: "Programming Languages", icon: "java" },
  { name: "SQL", category: "Programming Languages", icon: "sql" },
  { name: "C", category: "Programming Languages", icon: "c" },
  { name: "Assembly", category: "Programming Languages", icon: "asm" },
  { name: "Kotlin", category: "Programming Languages", icon: "java" },

  { name: "React", category: "Frontend", icon: "react" },
  { name: "Next.js", category: "Frontend", icon: "next" },
  { name: "HTML", category: "Frontend", icon: "api" },
  { name: "CSS", category: "Frontend", icon: "tailwind" },
  { name: "Tailwind CSS", category: "Frontend", icon: "tailwind" },

  { name: "Node.js", category: "Backend", icon: "js" },
  { name: "FastAPI", category: "Backend", icon: "python" },
  { name: "REST APIs", category: "Backend", icon: "api" },
  { name: "AWS Lambda", category: "Backend", icon: "api" },
  { name: "SQLite", category: "Backend", icon: "sql" },

  { name: "Playwright", category: "Testing & Automation", icon: "opengl" },
  { name: "Vitest", category: "Testing & Automation", icon: "js" },
  { name: "Postman", category: "Testing & Automation", icon: "api" },

  { name: "TensorFlow", category: "AI & Data", icon: "tensor" },
  { name: "PyTorch", category: "AI & Data", icon: "tensor" },
  { name: "Scikit-learn", category: "AI & Data", icon: "sklearn" },
  { name: "Pandas", category: "AI & Data", icon: "pandas" },
  { name: "OpenCV", category: "AI & Data", icon: "opengl" },

  { name: "Git", category: "Tools", icon: "git-branch" },
  { name: "Linux", category: "Tools", icon: "linux" },
  { name: "LogRocket", category: "Tools", icon: "api" },
  { name: "Mixpanel", category: "Tools", icon: "pandas" },
  { name: "Linear", category: "Tools", icon: "git-branch" },
  { name: "Cursor", category: "Tools", icon: "vscode" },
  { name: "Claude CLI", category: "Tools", icon: "asm" },
];

export const SKILL_CATEGORIES = [
  "All",
  "Programming Languages",
  "Frontend",
  "Backend",
  "Testing & Automation",
  "AI & Data",
  "Tools",
] as const;
