import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, Download } from 'lucide-react';
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
    const [isDownloading, setIsDownloading] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleResumeClick = (e) => {
        e.preventDefault();
        if (isDownloading) return;

        setIsDownloading(true);

        // Animate, then download after animation
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Deepu_Issac_Gigi_Resume.pdf';
            link.click();

            setTimeout(() => setIsDownloading(false), 500);
        }, 600);
    };

    return (
        <section id="hero" className="hero">
            {/* Background */}
            <div className="hero__background">
                <div className="hero__orb hero__orb--1"></div>
                <div className="hero__orb hero__orb--2"></div>
                <div className="hero__grid"></div>
            </div>

            {/* Content */}
            <div className="hero__content">
                {/* Status Badge */}
                <div className="hero__badge">
                    <span className="hero__badge-dot"></span>
                    Available for opportunities
                </div>

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

                {/* Tagline */}
                <p className="hero__tagline">
                    <Typewriter text="Building digital experiences that matter." delay={60} />
                </p>

                {/* Buttons */}
                <div className="hero__buttons">
                    <Button variant="primary" onClick={() => scrollToSection('projects')}>
                        View Projects
                    </Button>
                    <Button variant="outline" onClick={() => scrollToSection('contact')}>
                        Let's Talk <ArrowRight size={18} />
                    </Button>
                    <button
                        className={`hero__resume-btn ${isDownloading ? 'downloading' : ''}`}
                        onClick={handleResumeClick}
                    >
                        <Download size={18} />
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
            </div>

            {/* Scroll Indicator - Separate from content */}
            <button className="hero__scroll" onClick={() => scrollToSection('about')}>
                <span>Scroll</span>
                <ChevronDown size={18} />
            </button>
        </section>
    );
};

export default Hero;
