const { Client } = require('@notionhq/client');

async function test() {
  const notion = new Client({ auth: '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' });
  try {
    console.log('Client created:', typeof notion);
    console.log('Has databases:', typeof notion.databases);
    const result = await notion.databases.query({
      database_id: '2cc7b6fdd025804c956bdc75115ca169',
    });
    console.log('Success! Found', result.results.length, 'posts');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();