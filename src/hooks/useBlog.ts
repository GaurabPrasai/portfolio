import { useState, useEffect } from "react";
import {
  fetchBlogPosts,
  fetchBlogContent,
  type NotionPost,
  type NotionBlock,
} from "../services/notionServices";

export function useBlogPosts() {
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { posts, loading };
}

export function useBlogContent(
  selectedPostId: string | null,
  page: string,
  prefetchedContent: Record<string, NotionBlock[]>
) {
  const [blogContent, setBlogContent] = useState<NotionBlock[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

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

  return { blogContent, loadingContent };
}

export function usePrefetch() {
  const [prefetchedContent, setPrefetchedContent] = useState<
    Record<string, NotionBlock[]>
  >({});

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

  return { prefetchedContent, prefetchBlogContent };
}
