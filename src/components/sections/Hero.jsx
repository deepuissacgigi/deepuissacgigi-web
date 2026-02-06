/**
 * Hero.jsx - Main Landing Section
 * 
 * Features:
 * - Animated typewriter tagline
 * - Role tags with custom colors
 * - Social links
 * - Resume download with animation
 * - Scroll indicator
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import './Hero.scss';

/* ============================================
   TYPEWRITER COMPONENT
   Displays text character by character
   ============================================ */
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

/* ============================================
   DATA CONFIGURATION
   ============================================ */

// Professional role tags
const roles = [
    { label: 'IoT Engineer', color: '#22c55e' },
    { label: 'UI/UX Designer', color: '#646cff' },
    { label: 'Full Stack Dev', color: '#f59e0b' },
];

// Social media links
const socials = [
    { icon: Github, href: 'https://github.com/deepuissacgigi', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/deepuissacgigi', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:deepuissacgigi@gmail.com', label: 'Email' },
];

/* ============================================
   HERO COMPONENT
   ============================================ */
const Hero = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    /**
     * Smooth scroll to a section by ID
     */
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    /**
     * Handle resume download with animation
     * Prevents double-clicks, animates for 1s before download
     */
    const handleResumeClick = (e) => {
        e.preventDefault();
        if (isDownloading) return;

        setIsDownloading(true);

        // Trigger download after animation completes
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Deepu_Issac_Gigi_Resume.pdf';
            link.click();
            setTimeout(() => setIsDownloading(false), 500);
        }, 1000);
    };

    return (
        <section id="hero" className="hero">
            {/* Decorative Background */}
            <div className="hero__background">
                <div className="hero__orb hero__orb--1"></div>
                <div className="hero__orb hero__orb--2"></div>
                <div className="hero__grid"></div>
            </div>

            {/* Main Content */}
            <div className="hero__content">
                {/* Name */}
                <h1 className="hero__title">
                    Deepu Issac <span className="hero__title--gradient">Gigi</span>
                </h1>

                {/* Role Tags */}
                <div className="hero__roles">
                    {roles.map((role) => (
                        <span
                            key={role.label}
                            className="hero__role"
                            style={{ '--color': role.color }}
                        >
                            {role.label}
                        </span>
                    ))}
                </div>

                {/* Animated Tagline */}
                <p className="hero__tagline">
                    <Typewriter text="Building digital experiences that matter." delay={60} />
                </p>

                {/* Action Buttons */}
                <div className="hero__buttons">
                    <Button variant="primary" onClick={() => scrollToSection('projects')}>
                        View Projects
                    </Button>
                    <Button variant="outline" onClick={() => scrollToSection('contact')}>
                        Let's Talk <ArrowRight size={18} />
                    </Button>

                    {/* Resume Download */}
                    <button
                        className={`hero__resume-btn ${isDownloading ? 'downloading' : ''}`}
                        onClick={handleResumeClick}
                    >
                        <div className="hero__resume-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <g className="download-arrow">
                                    <path d="M12 3v12" />
                                    <path d="m8 11 4 4 4-4" />
                                </g>
                                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                            </svg>
                        </div>
                        <span>{isDownloading ? 'Downloading...' : 'Resume'}</span>
                        <div className="hero__resume-shimmer"></div>
                    </button>
                </div>

                {/* Social Links */}
                <div className="hero__socials">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social"
                            aria-label={social.label}
                        >
                            <social.icon size={20} />
                        </a>
                    ))}
                </div>

                {/* Availability Badge */}
                <div className="hero__badge">
                    <span className="hero__badge-dot"></span>
                    Available for opportunities
                </div>
            </div>

            {/* Scroll Indicator */}
            <button className="hero__scroll" onClick={() => scrollToSection('about')}>
                <div className="hero__scroll-mouse">
                    <div className="hero__scroll-wheel"></div>
                </div>
                <div className="hero__scroll-arrows">
                    <ChevronDown size={20} className="arrow-1" />
                    <ChevronDown size={20} className="arrow-2" />
                </div>
            </button>
        </section>
    );
};

export default Hero;
