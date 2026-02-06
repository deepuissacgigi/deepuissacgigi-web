/**
 * Header.jsx - Site Navigation Header
 * 
 * Features:
 * - Shrinks on scroll
 * - Desktop navigation with smooth scroll
 * - Mobile hamburger menu
 * - Logo animation
 */

import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Track scroll position for header style change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /**
     * Smooth scroll to section and close mobile menu
     */
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Navigation items
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                {/* Logo */}
                <div className="logo" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="sans-serif" style={{ letterSpacing: '1px' }}>
                            DG.
                        </text>
                        <rect x="2" y="2" width="56" height="36" rx="4" stroke="var(--color-accent)" strokeWidth="2" opacity="0" className="logo-border" />
                    </svg>
                </div>

                {/* Desktop Navigation */}
                <nav className="main-nav">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button onClick={() => scrollToSection(item.id)} className="nav-link">
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button onClick={() => scrollToSection(item.id)} className="mobile-nav-link">
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
