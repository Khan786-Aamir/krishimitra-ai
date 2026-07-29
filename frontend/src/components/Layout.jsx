import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Navbar, Footer, Button } from './ui';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Layout = () => {
  const { t } = useTranslation();
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
          { label: t('nav.features'), to: '/#features' },
          { label: t('nav.marketplace'), to: '/marketplace' },
          { label: t('nav.equipment'), to: '/rentals' },
          { label: t('nav.aiPlatform'), to: '/#ai-showcase' },
          { label: t('nav.about'), to: '/#how-it-works' },
          { label: t('nav.faq'), to: '/#faq' },
        ]}
        actions={
          isAuthenticated ? (
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <span className="hidden sm:inline text-xs text-text/50 font-medium">
                {t('nav.welcome')}, <span className="text-text font-bold">{user?.name}</span> ({user?.role})
              </span>
              <Button
                as={Link}
                to={getDashboardPath()}
                variant="outline"
                size="sm"
                className="gap-1.5"
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                {t('nav.dashboard')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 gap-1.5"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">{t('nav.signOut')}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Button as={Link} to="/login" variant="outline" size="sm">
                {t('nav.signIn')}
              </Button>
              <Button as={Link} to="/register" variant="primary" size="sm">
                {t('hero.getStarted')}
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
          { label: t('nav.marketplace'), to: '/marketplace' },
          { label: t('nav.equipment'), to: '/rentals' },
          { label: t('sidebar.community'), to: '/#community' },
        ]}
      />
    </div>
  );
};

export default Layout;
