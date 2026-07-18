import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Navbar, Footer, Button } from './ui';

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
    <div className="min-h-screen flex flex-col bg-background text-text">
      {/* Sticky Global Header Navbar */}
      <Navbar
        links={[
          { label: 'Features', to: '/#features' },
          { label: 'Marketplace', to: '/marketplace' },
          { label: 'Equipment', to: '/rentals' },
          { label: 'AI Platform', to: '/#ai-showcase' },
          { label: 'About', to: '/#how-it-works' },
          { label: 'FAQ', to: '/#faq' },
        ]}
        actions={
          isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-text/50 font-medium">
                Welcome, <span className="text-text font-bold">{user?.name}</span> ({user?.role})
              </span>
              <Button
                as={Link}
                to={getDashboardPath()}
                variant="outline"
                size="sm"
                className="gap-1.5"
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 gap-1.5"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button as={Link} to="/login" variant="outline" size="sm">
                Sign In
              </Button>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Get Started
              </Button>
            </div>
          )
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer
        links={[
          { label: 'Marketplace', to: '/marketplace' },
          { label: 'Rentals', to: '/rentals' },
          { label: 'Forum', to: '/forum' },
        ]}
      />
    </div>
  );
};

export default Layout;
