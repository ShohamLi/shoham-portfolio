export type SkillCategory =
  | "All"
  | "Programming Languages"
  | "Frontend"
  | "Backend"
  | "Testing & Automation"
  | "AI & Data"
  | "Tools";

export type IconName =
  | "github"
  | "linkedin"
  | "mail"
  | "cv"
  | "spine"
  | "api"
  | "python"
  | "java"
  | "c"
  | "sql"
  | "asm"
  | "js"
  | "next"
  | "react"
  | "tailwind"
  | "framer"
  | "pandas"
  | "numpy"
  | "sklearn"
  | "tensor"
  | "keras"
  | "jupyter"
  | "colab"
  | "git-branch"
  | "vscode"
  | "vmware"
  | "opengl"
  | "vercel"
  | "windows"
  | "linux"
  | "apple";

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  logoIcon: IconName;
};

export type Skill = {
  name: string;
  category: Exclude<SkillCategory, "All">;
  icon: IconName;
};
