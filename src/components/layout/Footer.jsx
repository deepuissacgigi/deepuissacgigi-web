import React from 'react';
import { Github, Linkedin, Mail, Twitter, ArrowUpRight } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
    const year = new Date().getFullYear();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer-v2">
            {/* CTA Section */}
            <div className="footer-cta">
                <h2 className="footer-cta__title">
                    Let's work <span>together</span>
                </h2>
                <p className="footer-cta__subtitle">
                    Have a project in mind? I'd love to hear about it.
                </p>
                <button
                    className="footer-cta__btn"
                    onClick={() => scrollToSection('contact')}
                >
                    Start a conversation
                    <ArrowUpRight size={18} />
                </button>
            </div>

            {/* Links Row */}
            <div className="footer-links">
                <div className="footer-links__row">
                    <button onClick={() => scrollToSection('hero')}>Home</button>
                    <span className="footer-links__dot">•</span>
                    <button onClick={() => scrollToSection('about')}>About</button>
                    <span className="footer-links__dot">•</span>
                    <button onClick={() => scrollToSection('projects')}>Work</button>
                    <span className="footer-links__dot">•</span>
                    <button onClick={() => scrollToSection('contact')}>Contact</button>
                </div>
            </div>

            {/* Social Icons */}
            <div className="footer-socials">
                <a href="https://github.com/deepuissacgigi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={22} />
                </a>
                <a href="https://linkedin.com/in/deepuissacgigi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={22} />
                </a>
                <a href="mailto:deepuissacgigi@gmail.com" aria-label="Email">
                    <Mail size={22} />
                </a>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <p>&copy; {year} Deepu Issac Gigi. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
