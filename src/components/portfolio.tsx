import { useState, useEffect } from "react";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { fetchBlogPosts } from "../services/notionServices";
import type { NotionPost } from "../services/notionServices";

export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [, setIsHovering ] = useState(false);
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-white" : "text-black",
    accent: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white" : "border-black",
    hover: isDark
      ? "hover:bg-white hover:text-black"
      : "hover:bg-black hover:text-white",
  };

  const projects = [
    { title: "Project Alpha", year: "2024", desc: "Digital experience design" },
    { title: "Project Beta", year: "2023", desc: "Interactive installation" },
    { title: "Project Gamma", year: "2023", desc: "Brand identity system" },
    { title: "Project Delta", year: "2022", desc: "Experimental interface" },
  ];

  // Fetch blog posts from Notion on component mount
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const notionPosts = await fetchBlogPosts();
      
      // Fallback to default posts if Notion fetch fails or returns empty
      if (notionPosts.length === 0) {
        setPosts([
          {
            id: "1",
            title: "On minimalism and restraint",
            date: "Dec 2024",
            preview: "Less is not just more—it is everything that matters, distilled.",
          },
          {
            id: "2",
            title: "The space between",
            date: "Nov 2024",
            preview: "White space is not empty. It is where the mind rests and meaning emerges.",
          },
          {
            id: "3",
            title: "Form follows function",
            date: "Oct 2024",
            preview: "Every element must justify its existence, or it is clutter.",
          },
        ]);
      } else {
        setPosts(notionPosts);
      }
      
      setLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300 font-mono`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-8 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <button
            onClick={() => setPage("home")}
            className={`text-2xl tracking-tighter ${theme.hover} transition-all px-2 py-1 border ${theme.border}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            GP
          </button>

          <nav className="flex gap-6 items-center">
            <button
              onClick={() => setPage("work")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Work
            </button>
            <button
              onClick={() => setPage("blog")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Blog
            </button>
            <button
              onClick={() => setPage("contact")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Contact
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 border ${theme.border} ${theme.hover} transition-all`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Home Page */}
      {page === "home" && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-12 gap-8">
              <div
                className={`col-span-1 border-l border-r ${theme.border} h-32`}
              ></div>
              <div className="col-span-10">
                <h1 className="text-7xl mb-8 leading-none tracking-tight">
                  Programmer
                  <br /> & Developer
                </h1>
                <div className="grid grid-cols-2 gap-16 mt-16">
                  <div className={`${theme.accent} space-y-4`}>
                    <p>
                      Creating digital experiences that prioritize clarity,
                      function, and intentional design.
                    </p>
                  </div>
                  <div className={`${theme.accent} space-y-4`}>
                    <p>
                      Based in Nepal, working globally. Available for select
                      projects.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`col-span-1 border-l border-r ${theme.border} h-32`}
              ></div>
            </div>

            {/* Featured Work Preview */}
            <div className="mt-32 grid grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project, i) => (
                <div
                  key={i}
                  className={`group border ${theme.border} p-8 ${theme.hover} transition-all cursor-pointer`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`text-sm ${theme.accent} mb-4`}>
                    {project.year}
                  </div>
                  <h3 className="text-2xl mb-2">{project.title}</h3>
                  <p className={theme.accent}>{project.desc}</p>
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                    <span className="text-xs tracking-wider">VIEW PROJECT</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Work Page */}
      {page === "work" && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl mb-16 tracking-tight">Selected Work</h2>
            <div className="space-y-1">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className={`group border-t ${theme.border} py-8 grid grid-cols-12 gap-8 ${theme.hover} transition-all cursor-pointer px-4`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="col-span-2 text-sm">{project.year}</div>
                  <div className="col-span-5 text-2xl">{project.title}</div>
                  <div className={`col-span-4 ${theme.accent}`}>
                    {project.desc}
                  </div>
                  <div className="col-span-1 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              ))}
              <div className={`border-t border-b ${theme.border}`}></div>
            </div>
          </div>
        </main>
      )}

      {/* Blog Page */}
      {page === "blog" && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl mb-16 tracking-tight">Writing</h2>
            
            {loading ? (
              <div className={`text-center ${theme.accent} py-20`}>
                Loading posts...
              </div>
            ) : (
              <div className="space-y-16">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className={`group border-l-2 ${theme.border} pl-8 ${theme.hover} transition-all cursor-pointer py-4 -ml-8`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className={`text-sm ${theme.accent} mb-2`}>
                      {post.date}
                    </div>
                    <h3 className="text-3xl mb-4 tracking-tight">{post.title}</h3>
                    <p className={`${theme.accent} text-lg`}>{post.preview}</p>
                    <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                      <span className="text-xs tracking-wider">READ MORE</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Contact Page */}
      {page === "contact" && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h2 className="text-5xl mb-8 tracking-tight">Let's talk</h2>
                <p className={`${theme.accent} text-lg mb-8`}>
                  I'm always interested in hearing about new projects and
                  opportunities.
                </p>
              </div>
              <div className="space-y-6">
                <div
                  className={`group border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`text-sm ${theme.accent} mb-2`}>Email</div>
                  <div className="text-xl flex items-center justify-between">
                    <span>gaurabprasaigp@gmail.com</span>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
                <div
                  className={`group border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`text-sm ${theme.accent} mb-2`}>Social</div>
                  <div className="text-xl flex items-center justify-between">
                    <span>@gaurabprasai</span>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
                <div
                  className={`group border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`text-sm ${theme.accent} mb-2`}>Location</div>
                  <div className="text-xl flex items-center justify-between">
                    <span>Biratnagar, Nepal</span>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className={`border-t ${theme.border} py-8 px-8`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className={theme.accent}>© 2025</div>
          <div className={theme.accent}>Gaurab Prasai</div>
        </div>
      </footer>
    </div>
  );
}