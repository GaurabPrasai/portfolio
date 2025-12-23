export type NotionPost = {
  id: string;
  title: string;
  date: string;
  preview: string;
};

export async function fetchBlogPosts(): Promise<NotionPost[]> {
  try {
    const res = await fetch("/api/notion");

    if (!res.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const data = await res.json();

    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text ?? "Untitled",
      date: page.properties.Date.date?.start ?? "",
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
