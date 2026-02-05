import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import './index.scss';

import { HelmetProvider } from 'react-helmet-async';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import { SpeedInsights } from '@vercel/speed-insights/react';


function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <HelmetProvider>
      <Router>
        <CustomCursor />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
        <SpeedInsights />
      </Router>
    </HelmetProvider>
  );
}

export default App;
