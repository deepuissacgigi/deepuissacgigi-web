/**
 * App.jsx - Main Application Entry
 * 
 * Core application setup including:
 * - React Router configuration
 * - SEO with HelmetProvider
 * - Loading screen
 * - Custom cursor
 * - Vercel analytics
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layout & Pages
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// UI Components
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';

// Analytics
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

// Styles
import './index.scss';

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
function App() {
  // Only show loader if we are on the home page ("/")
  // This prevents the loader from appearing on 404 pages
  const [isLoading, setIsLoading] = useState(window.location.pathname === '/');

  // Show loading screen on initial load
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <HelmetProvider>
      <Router>
        {/* Global UI Elements */}
        <CustomCursor />

        <Routes>
          {/* Main page with Layout (navbar/footer) */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          {/* 404 Page - No Layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Vercel Analytics */}
        <SpeedInsights />
        <Analytics />
      </Router>
    </HelmetProvider>
  );
}

export default App;
