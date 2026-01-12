import { ArrowUpRight } from "lucide-react";

export interface Project {
  title: string;
  year: string;
  desc: string;
  url: string;
}

interface ProjectCardProps {
  project: Project;
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProjectCard({
  project,
  theme,
  onMouseEnter,
  onMouseLeave,
}: ProjectCardProps) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group border ${theme.border} p-4 md:p-8 ${theme.hover} transition-all cursor-pointer block`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`text-xs md:text-sm ${theme.accent} mb-3 md:mb-4`}>
        {project.year}
      </div>
      <h3 className="text-xl md:text-2xl mb-2">{project.title}</h3>
      <p className={`${theme.accent} text-sm md:text-base`}>{project.desc}</p>
      <div className="mt-4 md:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
        <span className="text-xs tracking-wider">VIEW PROJECT</span>
        <ArrowUpRight size={14} />
      </div>
    </a>
  );
}
