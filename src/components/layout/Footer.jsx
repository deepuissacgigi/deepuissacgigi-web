import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, Heart } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
    const year = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { label: 'Home', id: 'hero' },
        { label: 'About', id: 'about' },
        { label: 'Projects', id: 'projects' },
        { label: 'Contact', id: 'contact' },
    ];

    const socials = [
        { icon: Github, href: 'https://github.com/deepuissacgigi', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com/in/deepuissacgigi', label: 'LinkedIn' },
        { icon: Mail, href: 'mailto:deepuissacgigi@gmail.com', label: 'Email' },
    ];

    return (
        <footer className="footer">
            {/* Main Footer Content */}
            <div className="footer__main">
                <div className="footer__container">
                    {/* Brand Section */}
                    <div className="footer__brand">
                        <div className="footer__logo" onClick={scrollToTop}>
                            DG<span>.</span>
                        </div>
                        <p className="footer__tagline">
                            Building digital experiences<br />
                            that matter.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__section">
                        <h4 className="footer__heading">Navigate</h4>
                        <nav className="footer__nav">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="footer__link"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Connect Section */}
                    <div className="footer__section">
                        <h4 className="footer__heading">Connect</h4>
                        <div className="footer__socials">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer__social"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Scroll to Top */}
                    <button className="footer__scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="footer__container">
                    <p className="footer__copyright">
                        &copy; {year} Deepu Issac Gigi
                    </p>
                    <p className="footer__made-with">
                        Made with <Heart size={14} className="footer__heart" /> in Germany
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
