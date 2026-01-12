import type { NotionBlock } from "../../services/notionServices";

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
          <p
            key={id}
            className="text-base md:text-lg leading-relaxed mb-4 md:mb-6"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </p>
        );

      case "heading_1":
        return (
          <h1
            key={id}
            className="text-3xl md:text-5xl font-normal mt-8 md:mt-12 mb-4 md:mb-6 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h1>
        );

      case "heading_2":
        return (
          <h2
            key={id}
            className="text-2xl md:text-3xl font-normal mt-8 md:mt-12 mb-4 md:mb-6 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h2>
        );

      case "heading_3":
        return (
          <h3
            key={id}
            className="text-xl md:text-2xl font-normal mt-6 md:mt-8 mb-3 md:mb-4 tracking-tight"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li
            key={id}
            className="text-base md:text-lg leading-relaxed ml-4 md:ml-6 mb-2 list-disc"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </li>
        );

      case "numbered_list_item":
        return (
          <li
            key={id}
            className="text-base md:text-lg leading-relaxed ml-4 md:ml-6 mb-2 list-decimal"
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </li>
        );

      case "code":
        return (
          <pre
            key={id}
            className={`p-3 md:p-4 rounded my-4 md:my-6 overflow-x-auto border ${
              isDark ? "bg-gray-900 border-white" : "bg-gray-100 border-black"
            }`}
          >
            <code className="font-mono text-xs md:text-sm">
              {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
                ""}
            </code>
          </pre>
        );

      case "quote":
        return (
          <blockquote
            key={id}
            className={`border-l-2 pl-4 md:pl-6 my-4 md:my-6 italic text-base md:text-lg ${
              isDark ? "border-white" : "border-black"
            }`}
          >
            {value?.rich_text?.map((text: any) => text.plain_text).join("") ||
              ""}
          </blockquote>
        );

      case "divider":
        return (
          <hr
            key={id}
            className={`my-6 md:my-8 ${
              isDark ? "border-white" : "border-black"
            }`}
          />
        );

      case "image":
        const imageUrl = value?.file?.url || value?.external?.url;
        return imageUrl ? (
          <img
            key={id}
            src={imageUrl}
            alt="Blog content"
            className="w-full my-6 md:my-8 rounded"
          />
        ) : null;

      default:
        return null;
    }
  };

  return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
}
