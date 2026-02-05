import React from 'react';
import Button from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import ThreeBackground from '../components/ui/ThreeBackground';
import ExperienceTimeline from '../components/ui/ExperienceTimeline';
import Projects from './Projects';
import Contact from './Contact';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
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

    const [aboutRef, aboutVisible] = useIntersectionObserver({ triggerOnce: true, threshold: 0.2 });

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
            <section id="about" className="about-section" style={{ position: 'relative', zIndex: 1, padding: '8rem 0' }}>
                <div className="container">
                    <div className="section-header animate-fade-in">

                        <h2
                            className={`section-title ${aboutVisible ? 'animate-glitch-reveal' : 'opacity-0'}`}
                            data-text="About Me"
                        >
                            About Me
                        </h2>
                    </div>

                    <div
                        ref={aboutRef}
                        className={`transition-wrapper glass-panel ${aboutVisible ? 'animate-blur' : 'opacity-0'}`}
                        style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                            <div className={`${aboutVisible ? 'animate-slide-left delay-1' : 'opacity-0'}`}>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9, marginBottom: '1.5rem' }}>
                                    Motivated MSc student with a passion for innovation, seeking opportunities to work in a dynamic and challenging environment.
                                    Eager to contribute through customer satisfaction and a commitment to excellence.
                                    I bridge the gap between design and development, creating scalable and performant user interfaces.
                                </p>
                                <Button variant="outline" onClick={() => scrollToSection('contact')}>Let's Connect</Button>
                            </div>
                            <div className={`${aboutVisible ? 'animate-slide-right delay-2' : 'opacity-0'}`}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#a5b4fc', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tech Stack</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                    {['React', 'UI/UX', 'IoT', 'JavaScript', 'HTML/CSS', 'Python', 'Android', 'Figma', 'Git'].map((skill) => (
                                        <span key={skill} className="glass-panel" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '4px', cursor: 'default', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
