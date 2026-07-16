import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-[#fafafa]">
      {/* Global Header Navigation */}
      <header className="border-b border-border-dark bg-background-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold tracking-tight font-display text-primary flex items-center space-x-2">
              <span className="h-6 w-6 bg-primary rounded flex items-center justify-center text-white font-sans text-xs">KM</span>
              <span>KrishiMitra AI</span>
            </Link>
            <nav className="hidden md:flex space-x-4 text-sm font-medium text-gray-400">
              <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link to="/rentals" className="hover:text-white transition-colors">Rentals</Link>
              <Link to="/forum" className="hover:text-white transition-colors">Forum</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Link to="/login" className="px-3 py-1.5 border border-border-dark rounded-md hover:bg-card-dark transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/register" className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark py-6 bg-[#0c0c0e] text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <p>© 2026 KrishiMitra AI. Built for Smart Agriculture & Direct Marketplace.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">SLA Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
