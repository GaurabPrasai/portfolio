interface FooterProps {
  theme: {
    border: string;
    accent: string;
  };
}

export default function Footer({ theme }: FooterProps) {
  return (
    <footer className={`border-t ${theme.border} py-6 md:py-8 px-4 md:px-8`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <div className={`${theme.accent} text-sm`}>© 2025</div>
        <div className={`${theme.accent} text-sm`}>Gaurab Prasai</div>
      </div>
    </footer>
  );
}
