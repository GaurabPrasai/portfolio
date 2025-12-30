export type NotionPost = {
  id: string;
  title: string;
  date: string;
  preview: string;
};

export type NotionBlock = {
  id: string;
  type: string;
  [key: string]: any;
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

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
      date: formatDate(page.properties.Date.date?.start ?? ""),
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function fetchBlogContent(pageId: string): Promise<NotionBlock[]> {
  try {
    const res = await fetch(`/api/notion?pageId=${pageId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch blog content");
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching blog content:", error);
    return [];
  }
}