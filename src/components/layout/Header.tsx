import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  setPage: (page: string) => void;
  theme: {
    border: string;
    hover: string;
    bg: string;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Header({
  isDark,
  setIsDark,
  setPage,
  theme,
  onMouseEnter,
  onMouseLeave,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 p-4 md:p-8 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <button
            onClick={() => handleNavClick("home")}
            className={`text-xl md:text-2xl tracking-tighter ${theme.hover} transition-all px-2 py-1 border ${theme.border}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            GP
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => setPage("work")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              Work
            </button>
            <button
              onClick={() => setPage("blog")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              Not A Blog
            </button>
            <button
              onClick={() => setPage("contact")}
              className={`${theme.hover} transition-all px-3 py-1 border ${theme.border}`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              Contact
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 border ${theme.border} ${theme.hover} transition-all`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden gap-2 items-center">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 border ${theme.border} ${theme.hover} transition-all`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 border ${theme.border} ${theme.hover} transition-all`}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-30 md:hidden ${theme.bg} pt-20 px-4`}>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => handleNavClick("work")}
              className={`${theme.hover} transition-all px-4 py-3 border ${theme.border} text-left text-lg`}
            >
              Work
            </button>
            <button
              onClick={() => handleNavClick("blog")}
              className={`${theme.hover} transition-all px-4 py-3 border ${theme.border} text-left text-lg`}
            >
              Not A Blog
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`${theme.hover} transition-all px-4 py-3 border ${theme.border} text-left text-lg`}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
