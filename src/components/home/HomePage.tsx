import ProjectCard, { type Project } from "../common/ProjectCard";

interface HomePageProps {
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  projects: Project[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function HomePage({
  theme,
  projects,
  onMouseEnter,
  onMouseLeave,
}: HomePageProps) {
  return (
    <main className="pt-24 md:pt-40 px-4 md:px-8 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
          <div
            className={`hidden md:block col-span-1 border-l border-r ${theme.border} h-32`}
          ></div>
          <div className="col-span-1 md:col-span-10">
            <h1 className="text-4xl md:text-7xl mb-6 md:mb-8 leading-tight md:leading-none tracking-tight">
              Programmer
              <br /> & Developer
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-8 md:mt-16">
              <div className={`${theme.accent} space-y-4 text-sm md:text-base`}>
                <p>
                  Creating digital experiences that prioritize clarity,
                  function, and intentional design.
                </p>
              </div>
              <div className={`${theme.accent} space-y-4 text-sm md:text-base`}>
                <p>
                  Based in Nepal, working globally. Available for select
                  projects.
                </p>
              </div>
            </div>
          </div>
          <div
            className={`hidden md:block col-span-1 border-l border-r ${theme.border} h-32`}
          ></div>
        </div>

        {/* Featured Work Preview */}
        <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {projects.slice(0, 2).map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              theme={theme}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
