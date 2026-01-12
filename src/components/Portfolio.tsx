import { useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./home/HomePage";
import WorkPage from "./work/WorkPage";
import BlogListPage from "./blog/BlogListPage";
import BlogDetailPage from "./blog/BlogDetailPage";
import ContactPage from "./contact/ContactPage";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "../hooks/useNavigation";
import { useBlogPosts, useBlogContent, usePrefetch } from "../hooks/useBlog";
import { projects } from "../data/projects";

export default function Portfolio() {
  const { isDark, setIsDark, theme } = useTheme();
  const { page, setPage, selectedPostId, setSelectedPostId } = useNavigation();
  const [, setIsHovering] = useState(false);

  // Blog hooks
  const { posts, loading } = useBlogPosts();
  const { prefetchedContent, prefetchBlogContent } = usePrefetch();
  const { blogContent, loadingContent } = useBlogContent(
    selectedPostId,
    page,
    prefetchedContent
  );

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setPage("blog-detail");
  };

  const handleBackToBlog = () => {
    setSelectedPostId(null);
    setPage("blog");
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300 font-mono`}
    >
      <Header
        isDark={isDark}
        setIsDark={setIsDark}
        setPage={setPage}
        theme={theme}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {page === "home" && (
        <HomePage
          theme={theme}
          projects={projects}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {page === "work" && (
        <WorkPage
          theme={theme}
          projects={projects}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {page === "blog" && (
        <BlogListPage
          theme={theme}
          posts={posts}
          loading={loading}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPostClick={handlePostClick}
          onPrefetch={prefetchBlogContent}
        />
      )}

      {page === "blog-detail" && selectedPostId && (
        <BlogDetailPage
          theme={theme}
          post={posts.find((p) => p.id === selectedPostId)}
          blogContent={blogContent}
          loadingContent={loadingContent}
          isDark={isDark}
          onBack={handleBackToBlog}
        />
      )}

      {page === "contact" && (
        <ContactPage
          theme={theme}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

      <Footer theme={theme} />
    </div>
  );
}
