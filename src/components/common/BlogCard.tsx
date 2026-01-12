import { ArrowUpRight } from "lucide-react";
import type { NotionPost } from "../../services/notionServices";

interface BlogCardProps {
  post: NotionPost;
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onPrefetch?: () => void;
}

export default function BlogCard({
  post,
  theme,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onPrefetch,
}: BlogCardProps) {
  return (
    <article
      className={`group border-l-2 ${theme.border} pl-4 md:pl-8 ${theme.hover} transition-all cursor-pointer py-3 md:py-4 -ml-4 md:-ml-8`}
      onMouseEnter={() => {
        onMouseEnter();
        onPrefetch?.();
      }}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={`text-xs md:text-sm ${theme.accent} mb-2`}>
        {post.date}
      </div>
      <h3 className="text-xl md:text-3xl mb-3 md:mb-4 tracking-tight">
        {post.title}
      </h3>
      <p className={`${theme.accent} text-base md:text-lg`}>{post.preview}</p>
      <div className="mt-4 md:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
        <span className="text-xs tracking-wider">READ MORE</span>
        <ArrowUpRight size={14} />
      </div>
    </article>
  );
}
