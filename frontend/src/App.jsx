import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Sprout, ShoppingBag, GraduationCap, ChevronRight } from 'lucide-react';
import { ThemeProvider } from './components/ui/theme/ThemeProvider';
import LandingPage from './pages/LandingPage';

// Import Farmer Dashboard components and layout
import DashboardLayout from './dashboard/layout/DashboardLayout';
import {
  DashboardHome,
  MyCrops,
  AIDiseasePreview,
  MarketplacePreview,
  EquipmentRentalPreview,
  CommunityPreview,
  AnalyticsPage,
  WeatherPage,
  SchemesPage,
  FarmerProfilePage,
  SettingsPage
} from './dashboard/pages';

// Import Buyer Dashboard components and layout
import BuyerLayout from './buyer/layout/BuyerLayout';
import {
  BuyerHome,
  BrowseCrops,
  FarmersDirectory,
  WishlistPage,
  OrdersPage,
  MarketPricesPage,
  CommunityPreviewPage as BuyerCommunityPage,
  BuyerAnalyticsPage,
  BuyerProfilePage,
  BuyerSettingsPage
} from './buyer/pages';

// Import Agriculture Expert Dashboard components and layout
import ExpertLayout from './expert/layout/ExpertLayout';
import {
  ExpertHome,
  AIDiagnosisReviewsPage,
  ConsultationsPage,
  AppointmentsPage,
  FarmersDirectoryPage as ExpertFarmersPage,
  KnowledgeHubPage,
  CommunityPreviewPage as ExpertCommunityPage,
  ExpertAnalyticsPage,
  ExpertProfilePage,
  ExpertSettingsPage
} from './expert/pages';

// Landing Page / Home Component
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Farmer': return '/farmer';
      case 'Buyer': return '/buyer';
      case 'Expert': return '/expert';
      default: return '/';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto py-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary mb-6 animate-pulse">
        <span>Smart Agriculture Platform</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
      
      <h1 className="text-5xl font-extrabold tracking-tight font-display mb-6 text-white leading-tight">
        Next-Generation MERN Platform for <span className="text-primary bg-clip-text">KrishiMitra AI</span>
      </h1>
      
      <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-2xl">
        Incorporating Gemini-powered crop diagnostics, direct marketplace transactions, peer-to-peer equipment leasing, and localized community expert advisory boards.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {isAuthenticated ? (
          <Navigate to={getDashboardPath()} replace />
        ) : (
          <>
            <a
              href="/register"
              className="px-6 py-3 bg-primary text-white hover:bg-primary-dark font-medium rounded-xl transition-all shadow-lg shadow-primary/10 w-full sm:w-auto"
            >
              Get Started Free
            </a>
            <a
              href="/login"
              className="px-6 py-3 border border-border-dark text-gray-300 hover:bg-card-dark font-medium rounded-xl transition-all w-full sm:w-auto"
            >
              Explore Platform
            </a>
          </>
        )}
      </div>

      {/* Trust & Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full max-w-xl text-left border-t border-border-dark pt-8">
        <div>
          <h4 className="text-white font-bold text-lg">MERN Stack</h4>
          <p className="text-gray-500 text-xs mt-1">React, Node, Express, MongoDB</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg">JWT Security</h4>
          <p className="text-gray-500 text-xs mt-1">Automatic session persistence</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg">Tailwind CSS</h4>
          <p className="text-gray-500 text-xs mt-1">SaaS inspired dark layout</p>
        </div>
      </div>
    </div>
  );
};

// Farmer Dashboard is now fully routed through src/dashboard/ layout and pages.

// Buyer Dashboard Placeholder
const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="bg-card-dark border border-border-dark p-8 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border-dark">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">Buyer Center</h1>
              <p className="text-gray-400 mt-1">Welcome back, <span className="text-white font-medium">{user?.name}</span></p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-secondary/10 text-indigo-400 text-sm font-semibold rounded-full border border-secondary/20">
            Role: Buyer
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Registered Phone</h3>
            <p className="text-lg font-bold text-white">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Marketplace Access</h3>
            <p className="text-lg font-bold text-white">Full Purchasing Privileges</p>
          </div>
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Security Clearance</h3>
            <p className="text-lg font-bold text-primary">Valid Session</p>
          </div>
        </div>

        <div className="p-6 bg-secondary/5 border border-secondary/15 rounded-2xl space-y-2">
          <h2 className="text-lg font-bold text-white font-display">Direct Marketplace Purchases</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your buyer account profile is successfully authenticated. Instant farm listings, direct payment processors, and crop bidding channels will follow in later phases.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            Sign Out Session
          </button>
        </div>
      </div>
    </div>
  );
};

// Expert Dashboard Placeholder
const ExpertDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="bg-card-dark border border-border-dark p-8 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border-dark">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-primary border border-primary/20 rounded-2xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">Expert Advisory Board</h1>
              <p className="text-gray-400 mt-1">Welcome back, <span className="text-white font-medium">{user?.name}</span></p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/20">
            Role: Agriculture Expert
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Contact Number</h3>
            <p className="text-lg font-bold text-white">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Advisory Clearance</h3>
            <p className="text-lg font-bold text-white">Full Consultant Panel</p>
          </div>
          <div className="p-6 bg-background-dark/50 border border-border-dark rounded-2xl space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Verification Status</h3>
            <p className="text-lg font-bold text-primary">Certified Expert</p>
          </div>
        </div>

        <div className="p-6 bg-primary/5 border border-primary/15 rounded-2xl space-y-2">
          <h2 className="text-lg font-bold text-white font-display">Farmer Consultations & Forum Moderation</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your agricultural expert account is verified. Direct consultative messaging platforms, community chat interfaces, and query response hubs are queued for Phase 3.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            Sign Out Session
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
        <Router>
          <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              
              {/* Public Authentications (restricted if user logged in) */}
              <Route element={<PublicRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Fallback Catch-all Route */}
              <Route path="*" element={
                <div className="flex-1 flex items-center justify-center p-6 bg-background-dark text-center">
                  <div className="max-w-md bg-card-dark border border-border-dark p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">Page not found</h2>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      The page you are looking for does not exist or has not been configured.
                    </p>
                    <a href="/" className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-medium transition-colors inline-block text-sm">
                      Go to Homepage
                    </a>
                  </div>
                </div>
              } />
            </Route>

            {/* Protected Dashboards (restricted if user logged out) */}
            <Route element={<ProtectedRoute />}>
              {/* Farmer Dashboard with custom full-bleed layout */}
              <Route path="farmer" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="crops" element={<MyCrops />} />
                <Route path="ai" element={<AIDiseasePreview />} />
                <Route path="marketplace" element={<MarketplacePreview />} />
                <Route path="equipment" element={<EquipmentRentalPreview />} />
                <Route path="weather" element={<WeatherPage />} />
                <Route path="schemes" element={<SchemesPage />} />
                <Route path="community" element={<CommunityPreview />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="profile" element={<FarmerProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Buyer Dashboard with custom full-bleed layout */}
              <Route path="buyer" element={<BuyerLayout />}>
                <Route index element={<BuyerHome />} />
                <Route path="browse" element={<BrowseCrops />} />
                <Route path="farmers" element={<FarmersDirectory />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="market-prices" element={<MarketPricesPage />} />
                <Route path="community" element={<BuyerCommunityPage />} />
                <Route path="analytics" element={<BuyerAnalyticsPage />} />
                <Route path="profile" element={<BuyerProfilePage />} />
                <Route path="settings" element={<BuyerSettingsPage />} />
              </Route>
              
              {/* Expert Dashboard with custom full-bleed layout */}
              <Route path="expert" element={<ExpertLayout />}>
                <Route index element={<ExpertHome />} />
                <Route path="reviews" element={<AIDiagnosisReviewsPage />} />
                <Route path="consultations" element={<ConsultationsPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="farmers" element={<ExpertFarmersPage />} />
                <Route path="knowledge-hub" element={<KnowledgeHubPage />} />
                <Route path="community" element={<ExpertCommunityPage />} />
                <Route path="analytics" element={<ExpertAnalyticsPage />} />
                <Route path="profile" element={<ExpertProfilePage />} />
                <Route path="settings" element={<ExpertSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
