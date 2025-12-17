"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    // Handle headers
    text = text.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-4">$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-6">$1</h1>');

    // Handle bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    text = text.replace(/\_\_(.*?)\_\_/g, '<strong class="font-bold">$1</strong>');

    // Handle italic
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(/\_(.*?)\_/g, '<em class="italic">$1</em>');

    // Handle links
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Handle code blocks
    text = text.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded my-4 overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>');

    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded font-mono text-sm">$1</code>');

    // Handle blockquotes
    text = text.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-700 dark:text-gray-300">$1</blockquote>');

    // Handle unordered lists
    text = text.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc my-2">$1</li>');
    text = text.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc my-2">$1</li>');

    // Handle ordered lists
    text = text.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal my-2">$1</li>');

    // Wrap consecutive list items in ul/ol
    text = text.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>)+/gs, '<ul class="my-4">$&</ul>');
    text = text.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>)+/gs, '<ol class="my-4">$&</ol>');

    // Handle line breaks
    text = text.replace(/\n\n/g, '</p><p class="my-4">');
    text = text.replace(/\n/g, '<br />');

    // Wrap in paragraph if not already wrapped
    if (!text.startsWith('<')) {
      text = '<p class="my-4">' + text + '</p>';
    }

    return text;
  };

  return (
    <div 
      className="markdown-content font-mono leading-relaxed"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}