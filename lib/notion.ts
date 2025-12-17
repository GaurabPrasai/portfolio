import type { Client as NotionClientType } from '@notionhq/client';
import type { NotionToMarkdown as NotionToMarkdownType } from 'notion-to-md';

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

let notionClient: NotionClientType | null = null;
let n2mClient: NotionToMarkdownType | null = null;

async function getNotionClient(): Promise<NotionClientType> {
  if (notionClient) return notionClient;

  const { Client } = await import('@notionhq/client');
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error('NOTION_API_KEY is not defined');
  }

  notionClient = new Client({ auth: apiKey });
  return notionClient;
}

async function getN2m(): Promise<NotionToMarkdownType> {
  if (n2mClient) return n2mClient;

  const { NotionToMarkdown } = await import('notion-to-md');
  const client = await getNotionClient();
  n2mClient = new NotionToMarkdown({ notionClient: client });
  return n2mClient;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const notion = await getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }

    const response = await notion.databases.query({
      database_id: databaseId,
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
        coverImage:
          page.cover?.external?.url || page.cover?.file?.url || undefined,
        tags:
          properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
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
    const notion = await getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }

    const response = await notion.databases.query({
      database_id: databaseId,
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

    // Get the content
    const n2m = await getN2m();
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const content = n2m.toMarkdownString(mdblocks);

    return {
      id: page.id,
      title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      date: properties.Date?.date?.start || new Date().toISOString(),
      preview: properties.Preview?.rich_text?.[0]?.plain_text || '',
      content: content.parent,
      coverImage:
        page.cover?.external?.url || page.cover?.file?.url || undefined,
      tags:
        properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      published: properties.Published?.checkbox || false,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const notion = await getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }

    const response = await notion.databases.query({
      database_id: databaseId,
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