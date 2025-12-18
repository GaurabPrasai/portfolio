import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  preview: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
        date: properties.Date?.date?.start || new Date().toISOString(),
        preview: properties.Preview?.rich_text?.[0]?.plain_text || '',
        coverImage: page.cover?.external?.url || page.cover?.file?.url || undefined,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        published: properties.Published?.checkbox || false,
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page: any = response.results[0];
    const properties = page.properties;

    // Get page content as blocks
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    // Convert blocks to simple markdown
    const content = blocks.results
      .map((block: any) => {
        if (block.type === 'paragraph') {
          return block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'heading_1') {
          return '# ' + block.heading_1.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'heading_2') {
          return '## ' + block.heading_2.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'heading_3') {
          return '### ' + block.heading_3.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'bulleted_list_item') {
          return '- ' + block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'numbered_list_item') {
          return '1. ' + block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('');
        }
        if (block.type === 'code') {
          return '```\n' + block.code.rich_text.map((t: any) => t.plain_text).join('') + '\n```';
        }
        return '';
      })
      .join('\n\n');

    return {
      id: page.id,
      title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      date: properties.Date?.date?.start || new Date().toISOString(),
      preview: properties.Preview?.rich_text?.[0]?.plain_text || '',
      content: content,
      coverImage: page.cover?.external?.url || page.cover?.file?.url || undefined,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      published: properties.Published?.checkbox || false,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results.map((page: any) => {
      return page.properties.Slug?.rich_text?.[0]?.plain_text || page.id;
    });
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}