import BlogCard from "../common/BlogCard";
import type { NotionPost } from "../../services/notionServices";

interface BlogListPageProps {
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  posts: NotionPost[];
  loading: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPostClick: (postId: string) => void;
  onPrefetch: (postId: string) => void;
}

export default function BlogListPage({
  theme,
  posts,
  loading,
  onMouseEnter,
  onMouseLeave,
  onPostClick,
  onPrefetch,
}: BlogListPageProps) {
  return (
    <main className="pt-24 md:pt-40 px-4 md:px-8 pb-12 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl mb-8 md:mb-16 tracking-tight">
          Writing
        </h2>

        {loading ? (
          <div
            className={`text-center ${theme.accent} py-12 md:py-20 text-sm md:text-base`}
          >
            Loading posts...
          </div>
        ) : (
          <div className="space-y-8 md:space-y-16">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                theme={theme}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={() => onPostClick(post.id)}
                onPrefetch={() => onPrefetch(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
