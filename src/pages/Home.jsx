import React from 'react';
import Button from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import ThreeBackground from '../components/ui/ThreeBackground';
import ExperienceTimeline from '../components/ui/ExperienceTimeline';
import Projects from './Projects';
import Contact from './Contact';
import About from '../components/sections/About';
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';
import '../index.scss';
import ScrollProgress from '../components/ui/ScrollProgress';
import { useState, useEffect } from 'react';

/* 
   TYPEWRITER COMPONENT 
   This component creates the typing effect for the subtitle.
   It works by taking the full 'text' and adding one character at a time 
   to 'currentText' every 'delay' milliseconds.
*/
const Typewriter = ({ text, delay = 100 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    /* This effect runs every time 'currentIndex' changes */
    useEffect(() => {
        if (currentIndex < text.length) {
            // Set a timer to add the next character
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout); // Cleanup timer to prevent errors
        }
    }, [currentIndex, delay, text]);

    return <span className="typing-cursor">{currentText}</span>;
};

const Home = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-page" style={{ position: 'relative', zIndex: 10 }}>
            <SeoHead {...SEO_DATA.home} />
            <ScrollProgress />
            <ThreeBackground />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <span className="accent-text animate-fade-in delay-1">
                            Hello, I'm
                        </span>
                        <h1 className="hero-title glitch" data-text="Deepu Issac Gigi">
                            Deepu Issac Gigi
                        </h1>

                        <p className="hero-subtitle animate-fade-in delay-3" style={{ minHeight: '1.6em' }}>
                            <Typewriter text="Masters in IoT & Smart Systems | Senior UI/UX Engineer" delay={50} />
                        </p>

                        <div className="hero-actions animate-fade-in delay-4">
                            <Button variant="primary" onClick={() => scrollToSection('projects')}>
                                View My Work
                            </Button>
                            <Button variant="outline" onClick={() => scrollToSection('contact')}>
                                Contact Me <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

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
