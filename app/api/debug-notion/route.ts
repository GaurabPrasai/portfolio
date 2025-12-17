// Create this file at: app/api/debug-notion/route.ts

import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Check environment variables
    if (!apiKey) {
      return NextResponse.json({
        error: 'NOTION_API_KEY is not set',
        details: 'Add NOTION_API_KEY to your .env.local file'
      }, { status: 500 });
    }

    if (!databaseId) {
      return NextResponse.json({
        error: 'NOTION_DATABASE_ID is not set',
        details: 'Add NOTION_DATABASE_ID to your .env.local file'
      }, { status: 500 });
    }

    const notion = new Client({ auth: apiKey });

    // Test 1: Try to retrieve the database
    let database;
    try {
      database = await notion.databases.retrieve({
        database_id: databaseId,
      });
    } catch (error: any) {
      return NextResponse.json({
        error: 'Failed to retrieve database',
        details: error.message,
        code: error.code,
        possibleIssues: [
          'Database ID might be incorrect',
          'Notion integration might not have access to this database',
          'Database might have been deleted or moved'
        ]
      }, { status: 500 });
    }

    // Test 2: Get database properties
    const properties = database.properties;
    const propertyNames = Object.keys(properties);

    // Test 3: Query the database (without filters)
    let queryResponse;
    try {
      queryResponse = await notion.databases.query({
        database_id: databaseId,
      });
    } catch (error: any) {
      return NextResponse.json({
        error: 'Failed to query database',
        details: error.message,
        databaseProperties: propertyNames
      }, { status: 500 });
    }

    // Test 4: Check if there are any pages
    const totalPages = queryResponse.results.length;

    // Test 5: Check for published pages
    let publishedPages = 0;
    try {
      const publishedResponse = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
      });
      publishedPages = publishedResponse.results.length;
    } catch (error: any) {
      // Published filter might not work
    }

    // Get sample page data
    let samplePage = null;
    if (queryResponse.results.length > 0) {
      const firstPage: any = queryResponse.results[0];
      samplePage = {
        id: firstPage.id,
        properties: Object.keys(firstPage.properties).map(key => {
          const prop = firstPage.properties[key];
          return {
            name: key,
            type: prop.type,
            value: getSampleValue(prop)
          };
        })
      };
    }

    return NextResponse.json({
      success: true,
      environmentCheck: {
        hasApiKey: !!apiKey,
        hasDatabaseId: !!databaseId,
        apiKeyPrefix: apiKey.substring(0, 10) + '...'
      },
      databaseInfo: {
        id: databaseId,
        title: (database as any).title?.[0]?.plain_text || 'No title',
        properties: propertyNames,
      },
      queryResults: {
        totalPages,
        publishedPages,
        hasPages: totalPages > 0,
        samplePage
      },
      requiredProperties: [
        'Title (title)',
        'Slug (rich_text)',
        'Date (date)',
        'Preview (rich_text)',
        'Published (checkbox)',
        'Tags (multi_select) - optional'
      ],
      recommendations: getRecommendations(propertyNames, totalPages, publishedPages)
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

function getSampleValue(prop: any): any {
  switch (prop.type) {
    case 'title':
      return prop.title?.[0]?.plain_text || null;
    case 'rich_text':
      return prop.rich_text?.[0]?.plain_text || null;
    case 'date':
      return prop.date?.start || null;
    case 'checkbox':
      return prop.checkbox;
    case 'multi_select':
      return prop.multi_select?.map((s: any) => s.name) || [];
    default:
      return null;
  }
}

function getRecommendations(propertyNames: string[], totalPages: number, publishedPages: number): string[] {
  const recommendations: string[] = [];

  const requiredProps = {
    'Title': 'title',
    'Slug': 'rich_text',
    'Date': 'date',
    'Preview': 'rich_text',
    'Published': 'checkbox'
  };

  // Check for missing properties
  for (const [propName, propType] of Object.entries(requiredProps)) {
    if (!propertyNames.includes(propName)) {
      recommendations.push(`❌ Missing property: "${propName}" (type: ${propType})`);
    } else {
      recommendations.push(`✅ Found property: "${propName}"`);
    }
  }

  if (totalPages === 0) {
    recommendations.push('⚠️ Database is empty. Add some pages to your Notion database.');
  } else {
    recommendations.push(`✅ Found ${totalPages} total pages in database`);
  }

  if (publishedPages === 0 && totalPages > 0) {
    recommendations.push('⚠️ No pages have Published checkbox set to true. Check at least one page as Published.');
  } else if (publishedPages > 0) {
    recommendations.push(`✅ Found ${publishedPages} published pages`);
  }

  return recommendations;
}

export const dynamic = 'force-dynamic';