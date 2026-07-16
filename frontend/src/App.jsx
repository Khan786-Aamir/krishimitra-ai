import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Base Placeholder Components for Module 1 Setup Verification
const Home = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
    <h1 className="text-4xl font-extrabold tracking-tight font-display mb-4 text-white">
      KrishiMitra AI: Smart Agriculture Platform
    </h1>
    <p className="text-gray-400 mb-6 leading-relaxed">
      A unified, production-ready MERN platform incorporating Gemini-based crop diagnostics, direct farmer marketplace transactions, P2P equipment leasing, and localized community forums.
    </p>
    <div className="flex space-x-3">
      <div className="px-4 py-2 bg-card-dark border border-border-dark rounded-md text-sm font-medium text-gray-300">
        Backend URL: <span className="font-mono text-primary">/api/v1</span>
      </div>
      <div className="px-4 py-2 bg-card-dark border border-border-dark rounded-md text-sm font-medium text-gray-300">
        Status: <span className="font-mono text-primary">Initialized</span>
      </div>
    </div>
  </div>
);

const LoginPlaceholder = () => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="bg-card-dark border border-border-dark p-8 rounded-lg max-w-sm w-full text-center">
      <h2 className="text-xl font-bold mb-2">Sign In</h2>
      <p className="text-gray-400 text-sm mb-4">Authentication module is queued for Phase 2.</p>
    </div>
  </div>
);

const RegisterPlaceholder = () => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="bg-card-dark border border-border-dark p-8 rounded-lg max-w-sm w-full text-center">
      <h2 className="text-xl font-bold mb-2">Create Account</h2>
      <p className="text-gray-400 text-sm mb-4">Registration wizard module is queued for Phase 2.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPlaceholder />} />
          <Route path="register" element={<RegisterPlaceholder />} />
          {/* Marketplace, Rentals, Forum pages to be filled in subsequent modules */}
          <Route path="*" element={
            <div className="flex-1 flex items-center justify-center p-6">
              <h2 className="text-lg font-medium text-gray-400">Page not implemented yet (Module 1 Setup)</h2>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
