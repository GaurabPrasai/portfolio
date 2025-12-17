import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/notion';

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in blog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds