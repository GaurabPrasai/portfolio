export default async function handler(req, res) {
  const { pageId } = req.query;

  // Set cache headers to cache responses
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  try {
    if (pageId) {
      // Fetch specific page content
      const response = await fetch(
        `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Notion API error:", error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      res.status(200).json(data);
    } else {
      // Fetch database with sorting to get recent posts first
      const response = await fetch(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sorts: [
              {
                property: "Date",
                direction: "descending"
              }
            ],
            page_size: 10 // Limit to 10 most recent posts
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Notion API error:", error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}