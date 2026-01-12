import { ArrowUpRight } from "lucide-react";

interface ContactCardProps {
  label: string;
  value: string;
  url: string;
  theme: {
    border: string;
    hover: string;
    accent: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ContactCard({
  label,
  value,
  url,
  theme,
  onMouseEnter,
  onMouseLeave,
}: ContactCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block border ${theme.border} p-4 md:p-6 ${theme.hover} transition-all cursor-pointer`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`text-xs md:text-sm ${theme.accent} mb-2`}>{label}</div>
      <div className="text-base md:text-xl flex items-center justify-between gap-2">
        <span className="break-all">{value}</span>
        <ArrowUpRight
          size={16}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 -translate-y-0 group-hover:-translate-y-1 flex-shrink-0"
        />
      </div>
    </a>
  );
}
