import { getBlogPost, getAllSlugs } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MarkdownRenderer from '@/components/markdown-renderer';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title + ' | Gaurab Prasai',
    description: post.preview,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* Back Button */}
        <Link 
          href="/?page=blog"
          className="inline-flex items-center gap-2 mb-12 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12 border border-black dark:border-white">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-12 border-b border-black dark:border-white pb-8">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">
            {formattedDate}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>
          {post.preview && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {post.preview}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-6 flex-wrap">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 border border-black dark:border-white text-sm font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <article className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content || ''} />
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-black dark:border-white">
          <Link 
            href="/?page=blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds