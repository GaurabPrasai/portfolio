import { ArrowUpRight } from "lucide-react";
import type { Project } from "./ProjectCard";

interface ProjectListItemProps {
  project: Project;
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProjectListItem({
  project,
  theme,
  onMouseEnter,
  onMouseLeave,
}: ProjectListItemProps) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group border-t ${theme.border} py-4 md:py-8 ${theme.hover} transition-all cursor-pointer px-3 md:px-4 block`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="text-xs">{project.year}</div>
          <ArrowUpRight
            size={16}
            className="opacity-50 group-hover:opacity-100 transition-all"
          />
        </div>
        <div className="text-lg font-medium">{project.title}</div>
        <div className={`text-sm ${theme.accent}`}>{project.desc}</div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-8">
        <div className="col-span-2 text-sm">{project.year}</div>
        <div className="col-span-5 text-2xl">{project.title}</div>
        <div className={`col-span-4 ${theme.accent}`}>{project.desc}</div>
        <div className="col-span-1 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </a>
  );
}
