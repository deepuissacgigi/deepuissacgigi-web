import React, { Suspense } from 'react';
// Lazy load heavy 3D background
const ThreeBackground = React.lazy(() => import('../components/ui/ThreeBackground'));
import ExperienceTimeline from '../components/ui/ExperienceTimeline';
import Projects from './Projects';
import Contact from './Contact';
import About from '../components/sections/About';
import Hero from '../components/sections/Hero';
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';
import '../index.scss';
import ScrollProgress from '../components/ui/ScrollProgress';

const Home = () => {
    return (
        <div className="home-page" style={{ position: 'relative', zIndex: 10 }}>
            <SeoHead {...SEO_DATA.home} />
            <ScrollProgress />
            <Suspense fallback={null}>
                <ThreeBackground />
            </Suspense>

            {/* Hero Section */}
            <Hero />

            {/* About Section */}
            <About />

            {/* Experience Timeline */}
            <ExperienceTimeline />

            {/* Projects Section */}
            <Projects />

            {/* Contact Section */}
            <Contact />
        </div>
    );
};

export default Home;
