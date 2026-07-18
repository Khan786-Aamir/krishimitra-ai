import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Farmer':
        return '/farmer';
      case 'Buyer':
        return '/buyer';
      case 'Expert':
        return '/expert';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-[#fafafa]">
      {/* Global Header Navigation */}
      <header className="border-b border-border-dark bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
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
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-gray-400 font-medium">
                  Welcome, <span className="text-white font-semibold">{user?.name}</span> ({user?.role})
                </span>
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-dark border border-border-dark rounded-md hover:bg-border-dark transition-colors font-medium text-gray-300 hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 border border-border-dark rounded-md hover:bg-card-dark transition-colors font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium">
                  Get Started
                </Link>
              </>
            )}
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
