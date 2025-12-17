"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  preview: string;
  coverImage?: string;
  tags?: string[];
}

export default function Portfolio() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState("home");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch blog posts when blog page is opened
  useEffect(() => {
    if (page === "blog" && posts.length === 0) {
      setLoading(true);
      fetch("/api/blog")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setLoading(false);
        });
    }
  }, [page, posts.length]);

  // Check URL params on mount for direct navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      setPage(pageParam);
    }
  }, []);

  // Update URL when page changes
  const changePage = (newPage: string) => {
    setPage(newPage);
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage);
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    const updateCursor = () => {
      if (cursorRef.current) {
        const scale = hoverRef.current ? 2 : 1;
        cursorRef.current.style.left = posRef.current.x - 40 + "px";
        cursorRef.current.style.top = posRef.current.y - 40 + "px";
        cursorRef.current.style.transform = `scale(${scale})`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = posRef.current.x - 3 + "px";
        cursorDotRef.current.style.top = posRef.current.y - 3 + "px";
      }

      rafRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateCursor);
      }

      const target = e.target as HTMLElement;
      const button = target.closest("button");
      const link = target.closest("a");
      const isClickable = !!(button || link);

      if (isClickable !== hoverRef.current) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          hoverRef.current = isClickable;
        }, 10);
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = "1";
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300 font-mono`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-8" style={{ zIndex: 40 }}>
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <button
            onClick={() => changePage("home")}
            className={`text-2xl tracking-tighter transition-all px-2 py-1 border ${theme.border}`}
          >
            GP
          </button>

          <nav className="flex gap-6 items-center">
            <button
              onClick={() => changePage("work")}
              className={`transition-all px-3 py-1 border ${theme.border}`}
            >
              Work
            </button>
            <button
              onClick={() => changePage("blog")}
              className={`transition-all px-3 py-1 border ${theme.border}`}
            >
              Blog
            </button>
            <button
              onClick={() => changePage("contact")}
              className={`transition-all px-3 py-1 border ${theme.border}`}
            >
              Contact
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 border ${theme.border} transition-all`}
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
                  <br />& Developer
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
                  className={`group border ${theme.border} p-8 transition-all cursor-pointer`}
                >
                  <div className={`text-sm ${theme.accent} mb-4`}>
                    {project.year}
                  </div>
                  <h3 className="text-2xl mb-2">{project.title}</h3>
                  <p className={theme.accent}>{project.desc}</p>
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-xs tracking-wider">View</span>
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
                  className={`group border-t ${theme.border} py-8 grid grid-cols-12 gap-8 transition-all cursor-pointer px-4 hover:pl-6`}
                >
                  <div className="col-span-2 text-sm">{project.year}</div>
                  <div className="col-span-6 text-2xl">{project.title}</div>
                  <div className={`col-span-4 ${theme.accent}`}>
                    {project.desc}
                  </div>
                  <div className="col-span-12 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-xs tracking-wider">View</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              ))}
              <div className={`border-t border-b ${theme.border}`}></div>
            </div>
          </div>
        </main>
      )}

      {/* Blog Page - Now with Notion Integration */}
      {page === "blog" && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl mb-16 tracking-tight">Writing</h2>
            
            {loading ? (
              <div className={`text-center ${theme.accent} py-12`}>
                <div className="animate-pulse">Loading posts...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className={`text-center ${theme.accent} py-12`}>
                <p>No blog posts found. Check your Notion configuration.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`block group border-l-2 ${theme.border} pl-8 transition-all py-4 -ml-8 hover:pl-10`}
                  >
                    <div className={`text-sm ${theme.accent} mb-2`}>
                      {formatDate(post.date)}
                    </div>
                    <h3 className="text-3xl mb-4 tracking-tight">{post.title}</h3>
                    {post.preview && (
                      <p className={`${theme.accent} text-lg`}>{post.preview}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs border ${theme.border}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                      <span className="text-xs tracking-wider">Read</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </Link>
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
                <a
                  href="mailto:gaurabprasai@gmail.com"
                  className={`group border ${theme.border} p-6 transition-all cursor-pointer block`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`text-sm ${theme.accent} mb-2`}>
                        Email
                      </div>
                      <div className="text-xl">gaurabprasai@gmail.com</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </a>
                <a
                  href="https://twitter.com/gaurabprasai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group border ${theme.border} p-6 transition-all cursor-pointer block`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`text-sm ${theme.accent} mb-2`}>
                        Social
                      </div>
                      <div className="text-xl">@gaurabprasai</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </a>
                <div
                  className={`group border ${theme.border} p-6 transition-all cursor-pointer`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`text-sm ${theme.accent} mb-2`}>
                        Location
                      </div>
                      <div className="text-xl">Biratnagar, Nepal</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                      <ArrowUpRight size={16} />
                    </div>
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