import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import './Hero.scss';

/* Typewriter Effect */
const Typewriter = ({ text, delay = 80 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return <span>{currentText}<span className="cursor">|</span></span>;
};

/* Role Tags */
const roles = [
    { label: 'IoT Engineer', color: '#22c55e' },
    { label: 'UI/UX Designer', color: '#646cff' },
    { label: 'Full Stack Dev', color: '#f59e0b' },
];

/* Social Links */
const socials = [
    { icon: Github, href: 'https://github.com/deepuissacgigi', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/deepuissacgigi', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:deepuissacgigi@gmail.com', label: 'Email' },
];

const Hero = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero-section-v2">
            {/* Background Effects */}
            <div className="hero-bg-effects">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="hero-container">
                {/* Status Badge */}
                <div className="status-badge">
                    <span className="status-dot"></span>
                    Available for opportunities
                </div>

                {/* Main Title */}
                <h1 className="hero-name">
                    Deepu Issac <span className="gradient-text">Gigi</span>
                </h1>

                {/* Role Tags */}
                <div className="role-tags">
                    {roles.map((role) => (
                        <span
                            key={role.label}
                            className="role-tag"
                            style={{ '--tag-color': role.color }}
                        >
                            {role.label}
                        </span>
                    ))}
                </div>

                {/* Subtitle with Typewriter */}
                <p className="hero-tagline">
                    <Typewriter text="Building digital experiences that matter." delay={60} />
                </p>

                {/* CTA Buttons */}
                <div className="hero-actions">
                    <Button variant="primary" onClick={() => scrollToSection('projects')}>
                        View Projects
                    </Button>
                    <Button variant="outline" onClick={() => scrollToSection('contact')}>
                        Let's Talk <ArrowRight size={18} />
                    </Button>
                </div>

                {/* Social Links */}
                <div className="hero-socials">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label={social.label}
                        >
                            <social.icon size={20} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator - Outside container for bottom positioning */}
            <div className="scroll-indicator" onClick={() => scrollToSection('about')}>
                <span>Scroll</span>
                <ChevronDown size={20} />
            </div>
        </section>
    );
};

export default Hero;
