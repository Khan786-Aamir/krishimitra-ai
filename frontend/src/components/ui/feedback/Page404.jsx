import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Logo } from '../branding/Logo';

export const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <header className="h-16 px-6 flex items-center border-b border-border">
        <Logo variant="compact" size="sm" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 mb-6 shrink-0 shadow-lg shadow-red-500/5">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold font-display text-text mb-4">404</h1>
        <h2 className="text-2xl font-bold font-display text-text mb-2">Page Not Found</h2>
        <p className="text-sm text-text/50 leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button
          as="a"
          href="/"
          variant="primary"
          leftIcon={<Home className="w-4 h-4" />}
        >
          Return Home
        </Button>
      </div>

      <footer className="py-6 border-t border-border text-center text-xs text-text/30">
        <p>© {new Date().getFullYear()} KrishiMitra AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page404;
