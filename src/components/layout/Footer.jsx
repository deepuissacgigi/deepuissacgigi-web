/**
 * Footer.jsx - Site Footer with Terminal Design
 * 
 * Features:
 * - Terminal-style status display
 * - Live clock update
 * - Navigation links
 * - Social links
 * - Version info
 */

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Terminal, Zap } from 'lucide-react';
import './Footer.scss';

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

/**
 * Format time in 24h format
 */
const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

/* ============================================
   FOOTER COMPONENT
   ============================================ */
const Footer = () => {
    const year = new Date().getFullYear();
    const [time, setTime] = useState(new Date());

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /**
     * Smooth scroll to section
     */
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    // Navigation items
    const navItems = [
        { id: 'hero', number: '01', label: 'Home' },
        { id: 'about', number: '02', label: 'About' },
        { id: 'projects', number: '03', label: 'Work' },
        { id: 'contact', number: '04', label: 'Contact' },
    ];

    // Social links
    const socials = [
        { href: 'https://github.com/deepuissacgigi', icon: Github, label: 'GH' },
        { href: 'https://linkedin.com/in/deepuissacgigi', icon: Linkedin, label: 'LI' },
        { href: 'mailto:deepuissacgigi@gmail.com', icon: Mail, label: 'EM' },
    ];

    return (
        <footer className="footer-cyber">
            {/* Animated Top Border */}
            <div className="footer-cyber__border"></div>

            <div className="footer-cyber__container">
                {/* Terminal Status */}
                <div className="footer-cyber__terminal">
                    <div className="terminal-header">
                        <Terminal size={14} />
                        <span>system.status</span>
                    </div>
                    <div className="terminal-content">
                        <p><span className="text-accent">&gt;</span> Location: <span className="text-glow">Germany</span></p>
                        <p><span className="text-accent">&gt;</span> Status: <span className="text-success">Available</span></p>
                        <p><span className="text-accent">&gt;</span> Time: <span className="text-glow">{formatTime(time)}</span></p>
                    </div>
                </div>

                {/* Center Logo & Navigation */}
                <div className="footer-cyber__center">
                    <div className="cyber-logo">
                        <svg width="50" height="34" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="26" fontWeight="900" fontFamily="sans-serif" style={{ letterSpacing: '2px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}>
                                DG.
                            </text>
                            <rect x="2" y="2" width="56" height="36" rx="4" stroke="var(--color-accent)" strokeWidth="2" opacity="0.8" className="logo-border" />
                        </svg>
                    </div>

                    <nav className="cyber-nav">
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => scrollToSection(item.id)}>
                                <span className="nav-number">{item.number}</span>
                                <span className="nav-text">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Social Links */}
                <div className="footer-cyber__socials">
                    <div className="socials-header">
                        <Zap size={14} />
                        <span>connect</span>
                    </div>
                    <div className="socials-grid">
                        {socials.map(social => (
                            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                                <social.icon size={20} />
                                <span className="social-label">{social.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-cyber__bottom">
                <div className="bottom-left">
                    <span className="version">v2.0.26</span>
                </div>
                <div className="bottom-center">
                    <span>&copy; {year} DEEPU ISSAC GIGI</span>
                </div>
                <div className="bottom-right">
                    <span className="coords">52.0°N 11.9°E</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
