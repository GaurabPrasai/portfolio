import type { NotionBlock } from "../services/notionServices";

interface NotionContentProps {
  blocks: NotionBlock[];
  isDark: boolean;
}

export default function NotionContent({ blocks, isDark }: NotionContentProps) {
  const renderBlock = (block: NotionBlock) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
      case "paragraph":
        return (
          <p key={id} className="text-lg leading-relaxed mb-6">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </p>
        );

      case "heading_1":
        return (
          <h1 key={id} className="text-5xl font-normal mt-12 mb-6 tracking-tight">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </h1>
        );

      case "heading_2":
        return (
          <h2 key={id} className="text-3xl font-normal mt-12 mb-6 tracking-tight">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </h2>
        );

      case "heading_3":
        return (
          <h3 key={id} className="text-2xl font-normal mt-8 mb-4 tracking-tight">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li key={id} className="text-lg leading-relaxed ml-6 mb-2">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </li>
        );

      case "numbered_list_item":
        return (
          <li key={id} className="text-lg leading-relaxed ml-6 mb-2">
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </li>
        );

      case "code":
        return (
          <pre
            key={id}
            className={`p-4 rounded my-6 overflow-x-auto border ${
              isDark ? "bg-gray-900 border-white" : "bg-gray-100 border-black"
            }`}
          >
            <code className="font-mono text-sm">
              {value.rich_text.map((text: any) => text.plain_text).join("")}
            </code>
          </pre>
        );

      case "quote":
        return (
          <blockquote
            key={id}
            className={`border-l-2 pl-6 my-6 italic ${
              isDark ? "border-white" : "border-black"
            }`}
          >
            {value.rich_text.map((text: any) => text.plain_text).join("")}
          </blockquote>
        );

      case "divider":
        return (
          <hr
            key={id}
            className={`my-8 ${isDark ? "border-white" : "border-black"}`}
          />
        );

      default:
        return (
          <p key={id} className="text-lg leading-relaxed mb-6">
            Unsupported block type: {type}
          </p>
        );
    }
  };

  return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
}