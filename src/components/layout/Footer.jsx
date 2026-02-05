import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming react-router is used
import './Footer.scss';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__top">
                    {/* Brand */}
                    <div className="footer__brand">
                        <span className="footer__logo">DG.</span>
                        <p className="footer__tagline">
                            Building digital experiences that matter.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="footer__nav">
                        <h4 className="footer__heading">Explore</h4>
                        <ul className="footer__links">
                            <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</button></li>
                            <li><button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>Projects</button></li>
                            <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</button></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="footer__socials">
                        <h4 className="footer__heading">Connect</h4>
                        <div className="footer__social-icons">
                            <a href="https://github.com/deepuissacgigi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="https://linkedin.com/in/deepuissacgigi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="mailto:deepuissacgigi@gmail.com" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        &copy; {new Date().getFullYear()} Deepu Issac Gigi. All rights reserved.
                    </p>
                    <button className="footer__scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
