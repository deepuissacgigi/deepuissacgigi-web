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
  const [isLoading, setIsLoading] = useState(true);

  // Show loading screen on initial load
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <HelmetProvider>
      <Router>
        {/* Global UI Elements */}
        <CustomCursor />

        {/* Main Layout - Only for main pages */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Layout>

        {/* 404 Page - Outside Layout (no navbar/footer) */}
        <Routes>
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
