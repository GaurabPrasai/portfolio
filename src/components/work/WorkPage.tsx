import ProjectListItem from "../common/ProjectListItem";
import type { Project } from "../common/ProjectCard";

interface WorkPageProps {
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  projects: Project[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function WorkPage({
  theme,
  projects,
  onMouseEnter,
  onMouseLeave,
}: WorkPageProps) {
  return (
    <main className="pt-24 md:pt-40 px-4 md:px-8 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl mb-8 md:mb-16 tracking-tight">
          Selected Work
        </h2>
        <div className="space-y-1">
          {projects.map((project, i) => (
            <ProjectListItem
              key={i}
              project={project}
              theme={theme}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          ))}
          <div className={`border-t border-b ${theme.border}`}></div>
        </div>
      </div>
    </main>
  );
}
