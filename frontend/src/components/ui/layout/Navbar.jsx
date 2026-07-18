import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Logo } from '../branding/Logo';
import { Button } from '../buttons/Button';
import { useTheme } from '../../../hooks/useTheme';

export const Navbar = ({
  links = [],
  actions,
  className = '',
  ...props
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-40 w-full bg-glass border-b border-glass shadow-sm ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Logo variant="compact" />
            <div className="hidden md:flex space-x-1">
              {links.map((link) => (
                <Button
                  key={link.to}
                  as={Link}
                  to={link.to}
                  variant="ghost"
                  size="sm"
                  className="text-text/75 hover:text-text font-medium"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 text-text/60 hover:text-text rounded-full hover:bg-surface/50"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            {actions}
          </div>

          {/* Mobile Navigation Header */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 text-text/60 rounded-full"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text/60 hover:text-text focus:outline-none p-1.5 hover:bg-surface/50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-glass bg-background/95 backdrop-blur-lg px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-text/70 hover:text-text hover:bg-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {actions && (
            <div className="pt-4 border-t border-glass flex flex-col gap-2.5">
              {actions}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
