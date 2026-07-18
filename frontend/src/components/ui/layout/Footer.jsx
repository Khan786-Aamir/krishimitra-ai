import React from 'react';
import { Logo } from '../branding/Logo';

export const Footer = ({
  links = [],
  className = '',
  ...props
}) => {
  return (
    <footer className={`border-t border-border py-8 bg-background/50 text-xs text-text/40 ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Logo variant="compact" size="sm" to="/" />
          <span className="hidden sm:inline text-text/20">|</span>
          <p>© {new Date().getFullYear()} KrishiMitra AI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          {links.map((link, index) => (
            <a key={index} href={link.to} className="hover:text-text transition-colors font-semibold">
              {link.label}
            </a>
          ))}
          {links.length === 0 && (
            <>
              <a href="#" className="hover:text-text transition-colors font-semibold">Privacy Policy</a>
              <a href="#" className="hover:text-text transition-colors font-semibold">Terms of Service</a>
              <a href="#" className="hover:text-text transition-colors font-semibold">Support</a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
