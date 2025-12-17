import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-8 text-center">
        <div className="border-2 border-black dark:border-white p-12">
          <h1 className="text-6xl font-bold mb-4 font-mono">404</h1>
          <h2 className="text-2xl mb-6">Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/?page=blog"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}