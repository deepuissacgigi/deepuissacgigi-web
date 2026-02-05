import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Terminal, Cpu, Zap } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
    const year = new Date().getFullYear();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <footer className="footer-cyber">
            {/* Animated Top Border */}
            <div className="footer-cyber__border"></div>

            <div className="footer-cyber__container">
                {/* Left - Terminal Style */}
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

                {/* Center - Logo & Nav */}
                <div className="footer-cyber__center">
                    <div className="cyber-logo">
                        <Cpu className="cyber-logo__icon" size={24} />
                        <span className="cyber-logo__text">DG</span>
                    </div>

                    <nav className="cyber-nav">
                        <button onClick={() => scrollToSection('hero')}>
                            <span className="nav-number">01</span>
                            <span className="nav-text">Home</span>
                        </button>
                        <button onClick={() => scrollToSection('about')}>
                            <span className="nav-number">02</span>
                            <span className="nav-text">About</span>
                        </button>
                        <button onClick={() => scrollToSection('projects')}>
                            <span className="nav-number">03</span>
                            <span className="nav-text">Work</span>
                        </button>
                        <button onClick={() => scrollToSection('contact')}>
                            <span className="nav-number">04</span>
                            <span className="nav-text">Contact</span>
                        </button>
                    </nav>
                </div>

                {/* Right - Socials */}
                <div className="footer-cyber__socials">
                    <div className="socials-header">
                        <Zap size={14} />
                        <span>connect</span>
                    </div>
                    <div className="socials-grid">
                        <a href="https://github.com/deepuissacgigi" target="_blank" rel="noopener noreferrer">
                            <Github size={20} />
                            <span className="social-label">GH</span>
                        </a>
                        <a href="https://linkedin.com/in/deepuissacgigi" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={20} />
                            <span className="social-label">LI</span>
                        </a>
                        <a href="mailto:deepuissacgigi@gmail.com">
                            <Mail size={20} />
                            <span className="social-label">EM</span>
                        </a>
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
