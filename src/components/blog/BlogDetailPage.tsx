import NotionContent from "../common/NotionContent";
import LoadingSkeleton from "../common/LoadingSkeleton";
import type { NotionPost, NotionBlock } from "../../services/notionServices";

interface BlogDetailPageProps {
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  post: NotionPost | undefined;
  blogContent: NotionBlock[];
  loadingContent: boolean;
  isDark: boolean;
  onBack: () => void;
}

export default function BlogDetailPage({
  theme,
  post,
  blogContent,
  loadingContent,
  isDark,
  onBack,
}: BlogDetailPageProps) {
  if (!post) return null;

  return (
    <main className="pt-24 md:pt-40 px-4 md:px-8 pb-12 md:pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`mb-6 md:mb-8 flex items-center gap-2 ${theme.hover} transition-all px-3 py-2 border ${theme.border} text-sm md:text-base`}
        >
          <span>←</span>
          <span>Back to Blog</span>
        </button>

        {/* Blog Content */}
        <article>
          <div className={`text-xs md:text-sm ${theme.accent} mb-3 md:mb-4`}>
            {post.date}
          </div>
          <h1 className="text-3xl md:text-6xl mb-6 md:mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div
            className={`border-l-2 ${theme.border} pl-4 md:pl-8 mb-8 md:mb-12`}
          >
            <p className={`${theme.accent} text-base md:text-xl`}>
              {post.preview}
            </p>
          </div>

          {/* Article Content */}
          {loadingContent ? (
            <LoadingSkeleton isDark={isDark} />
          ) : blogContent.length > 0 ? (
            <NotionContent blocks={blogContent} isDark={isDark} />
          ) : (
            <div className="space-y-6">
              <p className="text-base md:text-lg leading-relaxed">
                No content available for this blog post yet.
              </p>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
