import { useState, useEffect } from "react";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { fetchBlogPosts, fetchBlogContent } from "../services/notionServices";
import type { NotionPost, NotionBlock } from "../services/notionServices";

function NotionContent({
  blocks,
  isDark,
}: {
  blocks: NotionBlock[];
  isDark: boolean;
}) {
  const renderBlock = (block: NotionBlock) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
      case "paragraph":
        return (
          <p key={id} className="text-lg leading-relaxed mb-6">
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </p>
        );

      case "heading_1":
        return (
          <h1
            key={id}
            className="text-5xl font-normal mt-12 mb-6 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h1>
        );

      case "heading_2":
        return (
          <h2
            key={id}
            className="text-3xl font-normal mt-12 mb-6 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h2>
        );

      case "heading_3":
        return (
          <h3
            key={id}
            className="text-2xl font-normal mt-8 mb-4 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li key={id} className="text-lg leading-relaxed ml-6 mb-2 list-disc">
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </li>
        );

      case "numbered_list_item":
        return (
          <li
            key={id}
            className="text-lg leading-relaxed ml-6 mb-2 list-decimal"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </li>
        );

      case "code":
        return (
          <pre
            key={id}
            className={`p-4 rounded my-6 overflow-x-auto border ${
              isDark ? "bg-gray-900 border-white" : "bg-gray-100 border-black"
            }`}
          >
            <code className="font-mono text-sm">
              {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
                ""}
            </code>
          </pre>
        );

      case "quote":
        return (
          <blockquote
            key={id}
            className={`border-l-2 pl-6 my-6 italic ${
              isDark ? "border-white" : "border-black"
            }`}
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </blockquote>
        );

      case "divider":
        return (
          <hr
            key={id}
            className={`my-8 ${isDark ? "border-white" : "border-black"}`}
          />
        );

      case "image":
        const imageUrl = value?.file?.url || value?.external?.url;
        return imageUrl ? (
          <img
            key={id}
            src={imageUrl}
            alt="Blog content"
            className="w-full my-8 rounded"
          />
        ) : null;

      default:
        return null;
    }
  };

  return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
}

export default function Portfolio() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
  });
  const [, setIsHovering] = useState(false);
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
  });
  const [blogContent, setBlogContent] = useState<NotionBlock[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [prefetchedContent, setPrefetchedContent] = useState<
    Record<string, NotionBlock[]>
  >({});

  // Prefetch function
  const prefetchBlogContent = async (postId: string) => {
    // Check if already prefetched or cached
    if (prefetchedContent[postId]) return;

    const cacheKey = `blog_content_${postId}`;
    const cachedContent = localStorage.getItem(cacheKey);

    if (cachedContent) {
      setPrefetchedContent((prev) => ({
        ...prev,
        [postId]: JSON.parse(cachedContent),
      }));
      return;
    }

    // Fetch in background
    try {
      const content = await fetchBlogContent(postId);
      if (content.length > 0) {
        setPrefetchedContent((prev) => ({
          ...prev,
          [postId]: content,
        }));
        localStorage.setItem(cacheKey, JSON.stringify(content));
        localStorage.setItem(
          `blog_content_time_${postId}`,
          Date.now().toString()
        );
      }
    } catch (error) {
      console.error("Prefetch error:", error);
    }
  };

  const theme = {
    bg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-white" : "text-black",
    accent: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white" : "border-black",
    hover: isDark
      ? "hover:bg-white hover:text-black"
      : "hover:bg-black hover:text-white",
  };

  // Update URL when page or post changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== "home") {
      params.set("page", page);
    }
    if (selectedPostId) {
      params.set("post", selectedPostId);
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newUrl);
  }, [page, selectedPostId]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPage(params.get("page") || "home");
      setSelectedPostId(params.get("post"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const projects = [
    {
      title: "Keyflow",
      year: "2025",
      desc: "A minimalistic typing web app",
      url: "https://github.com/gaurabprasai/keyflow",
    },
    {
      title: "Phemis",
      year: "2024",
      desc: "Movie recommendation system",
      url: "https://github.com/gaurabprasai/phemis",
    },
    {
      title: "Network",
      year: "2024",
      desc: "Social networking site",
      url: "https://github.com/gaurabprasai/network",
    },
    {
      title: "CS50x",
      year: "2024",
      desc: "A curated collection of projects completed during the CS50x course",
      url: "https://github.com/gaurabprasai/cs50x",
    },
  ];

  // Fetch blog posts from Notion on component mount
  useEffect(() => {
    async function loadPosts() {
      // Check if we have cached posts
      const cachedPosts = localStorage.getItem("cached_posts");
      const cacheTime = localStorage.getItem("cache_time");
      const now = Date.now();

      // Use cache if it's less than 5 minutes old
      if (cachedPosts && cacheTime && now - parseInt(cacheTime) < 300000) {
        setPosts(JSON.parse(cachedPosts));
        setLoading(false);
        return;
      }

      setLoading(true);
      const notionPosts = await fetchBlogPosts();

      // Fallback to default posts if Notion fetch fails or returns empty
      if (notionPosts.length === 0) {
        const defaultPosts = [
          {
            id: "1",
            title: "On minimalism and restraint",
            date: "Dec 2024",
            preview:
              "Less is not just more—it is everything that matters, distilled.",
          },
          {
            id: "2",
            title: "The space between",
            date: "Nov 2024",
            preview:
              "White space is not empty. It is where the mind rests and meaning emerges.",
          },
          {
            id: "3",
            title: "Form follows function",
            date: "Oct 2024",
            preview:
              "Every element must justify its existence, or it is clutter.",
          },
        ];
        setPosts(defaultPosts);
      } else {
        setPosts(notionPosts);
        // Cache the posts
        localStorage.setItem("cached_posts", JSON.stringify(notionPosts));
        localStorage.setItem("cache_time", now.toString());
      }

      setLoading(false);
    }

    loadPosts();
  }, []);

  // Fetch blog content when a post is selected
  useEffect(() => {
    async function loadBlogContent() {
      if (selectedPostId && page === "blog-detail") {
        // Check if we have prefetched content
        if (prefetchedContent[selectedPostId]) {
          setBlogContent(prefetchedContent[selectedPostId]);
          setLoadingContent(false);
          return;
        }

        // Check if we have cached content for this post
        const cacheKey = `blog_content_${selectedPostId}`;
        const cachedContent = localStorage.getItem(cacheKey);
        const cacheTimeKey = `blog_content_time_${selectedPostId}`;
        const cacheTime = localStorage.getItem(cacheTimeKey);
        const now = Date.now();

        // Use cache if it's less than 10 minutes old
        if (cachedContent && cacheTime && now - parseInt(cacheTime) < 600000) {
          setBlogContent(JSON.parse(cachedContent));
          setLoadingContent(false);
          return;
        }

        setLoadingContent(true);
        const content = await fetchBlogContent(selectedPostId);
        setBlogContent(content);

        // Cache the content
        if (content.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(content));
          localStorage.setItem(cacheTimeKey, now.toString());
        }

        setLoadingContent(false);
      }
    }

    loadBlogContent();
  }, [selectedPostId, page, prefetchedContent]);

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
              Not A Blog
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
                <a
                  key={i}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group border ${theme.border} p-8 ${theme.hover} transition-all cursor-pointer block`}
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
                </a>
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
                <a
                  key={i}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group border-t ${theme.border} py-8 grid grid-cols-12 gap-8 ${theme.hover} transition-all cursor-pointer px-4 block`}
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
                </a>
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
                    onMouseEnter={() => {
                      setIsHovering(true);
                      // Prefetch content on hover
                      prefetchBlogContent(post.id);
                    }}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => {
                      setSelectedPostId(post.id);
                      setPage("blog-detail");
                    }}
                  >
                    <div className={`text-sm ${theme.accent} mb-2`}>
                      {post.date}
                    </div>
                    <h3 className="text-3xl mb-4 tracking-tight">
                      {post.title}
                    </h3>
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

      {/* Blog Detail Page */}
      {page === "blog-detail" && selectedPostId && (
        <main className="pt-40 px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedPostId(null);
                setPage("blog");
              }}
              className={`mb-8 flex items-center gap-2 ${theme.hover} transition-all px-3 py-2 border ${theme.border}`}
            >
              <span>←</span>
              <span>Back to Blog</span>
            </button>

            {/* Blog Content */}
            {(() => {
              const post = posts.find((p) => p.id === selectedPostId);
              if (!post) return null;

              return (
                <article>
                  <div className={`text-sm ${theme.accent} mb-4`}>
                    {post.date}
                  </div>
                  <h1 className="text-6xl mb-8 tracking-tight leading-tight">
                    {post.title}
                  </h1>

                  <div className={`border-l-2 ${theme.border} pl-8 mb-12`}>
                    <p className={`${theme.accent} text-xl`}>{post.preview}</p>
                  </div>

                  {/* Article Content */}
                  {loadingContent ? (
                    <div className="space-y-6 animate-pulse">
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-full`}
                      ></div>
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-5/6`}
                      ></div>
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-4/6`}
                      ></div>
                      <div
                        className={`h-8 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-2/6 mt-8`}
                      ></div>
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-full`}
                      ></div>
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-5/6`}
                      ></div>
                      <div
                        className={`h-4 ${
                          isDark ? "bg-gray-800" : "bg-gray-200"
                        } rounded w-3/6`}
                      ></div>
                    </div>
                  ) : blogContent.length > 0 ? (
                    <NotionContent blocks={blogContent} isDark={isDark} />
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg leading-relaxed">
                        No content available for this blog post yet.
                      </p>
                    </div>
                  )}
                </article>
              );
            })()}
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
                  href="https://mail.google.com/mail/?view=cm&to=gaurabprasaigp@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
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
                </a>

                <a
                  href="https://www.linkedin.com/in/gaurab-prasai-6a771831a?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
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
                </a>
                <a
                  href="https://maps.app.goo.gl/VcWQJApXPXNwfnPJ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block border ${theme.border} p-6 ${theme.hover} transition-all cursor-pointer`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`text-sm ${theme.accent} mb-2`}>Address</div>

                  <div className="text-xl flex items-center justify-between">
                    <span>Biratnagar, Nepal</span>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1"
                    />
                  </div>
                </a>
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
