import React from 'react';
import { RefreshCw, ServerCrash } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Logo } from '../branding/Logo';

export const Page500 = ({
  onRetry,
  ...props
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text" {...props}>
      <header className="h-16 px-6 flex items-center border-b border-border">
        <Logo variant="compact" size="sm" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 mb-6 shrink-0 shadow-lg shadow-red-500/5">
          <ServerCrash className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold font-display text-text mb-4">500</h1>
        <h2 className="text-2xl font-bold font-display text-text mb-2">Internal Server Error</h2>
        <p className="text-sm text-text/50 leading-relaxed mb-8">
          The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {onRetry ? (
            <Button
              variant="primary"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Retry Connection
            </Button>
          ) : (
            <Button
              as="a"
              href="/"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>

      <footer className="py-6 border-t border-border text-center text-xs text-text/30">
        <p>© {new Date().getFullYear()} KrishiMitra AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page500;
