/**
 * Home.jsx - Main Landing Page
 * 
 * Combines all main sections:
 * - 3D Background (lazy loaded)
 * - Hero section
 * - About section
 * - Experience timeline
 * - Projects showcase
 * - Contact form
 */

import React, { Suspense } from 'react';

// Lazy load heavy 3D component for performance
const ThreeBackground = React.lazy(() => import('../components/ui/ThreeBackground'));

// Components
import ScrollProgress from '../components/ui/ScrollProgress';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import ExperienceTimeline from '../components/ui/ExperienceTimeline';
import Projects from './Projects';
import Contact from './Contact';

// SEO
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';

/* ============================================
   HOME PAGE COMPONENT
   ============================================ */
const Home = () => {
    return (
        <div className="home-page" style={{ position: 'relative', zIndex: 10 }}>
            {/* SEO Meta Tags */}
            <SeoHead {...SEO_DATA.home} />

            {/* Scroll Progress Indicator */}
            <ScrollProgress />

            {/* 3D Animated Background */}
            <Suspense fallback={null}>
                <ThreeBackground />
            </Suspense>

            {/* Page Sections */}
            <Hero />
            <About />
            <ExperienceTimeline />
            <Projects />
            <Contact />
        </div>
    );
};

export default Home;
