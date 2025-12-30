export default async function handler(req, res) {
  const { pageId } = req.query;

  try {
    // If pageId is provided, fetch that specific page's content
    if (pageId) {
      const response = await fetch(
        `https://api.notion.com/v1/blocks/${pageId}/children`,
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
      // Otherwise, fetch the database list
      const response = await fetch(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
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
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}