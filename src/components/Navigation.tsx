import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Testimonials', id: 'testimonials' },
  ];

  return (
    <nav
  className={`fixed left-0 right-0 z-50 mx-auto rounded-full
    transition-[background-color,backdrop-filter,box-shadow,margin,max-width]
    duration-700 ease-out
    ${isScrolled
      ? 'bg-card/95 backdrop-blur-md shadow-soft max-w-[80%] mt-4'
      : 'bg-transparent max-w-[95%] mt-4'}
  `}
>


      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-corinthia text-4xl lg:font-bold text-primary sm:font-light md:font-light"
            style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)' }}
          >
            The Wedding Shades
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-smooth font-medium ${
                    isScrolled
                    ? 'text-secondary hover:text-primary'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden bg-transparent text-secondary ${
              isScrolled
              ? 'text-black'
              : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="text-black"/> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-foreground hover:text-primary transition-smooth font-medium text-left py-2 ${
                    isScrolled
                    ? 'text-gray-900'
                    : 'text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
