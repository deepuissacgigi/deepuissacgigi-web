import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../index.scss';


const Header = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false); // Close menu after navigation
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
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
                        <li><button onClick={() => scrollToSection('home')} className="nav-link">Home</button></li>
                        <li><button onClick={() => scrollToSection('about')} className="nav-link">About</button></li>
                        <li><button onClick={() => scrollToSection('projects')} className="nav-link">Projects</button></li>
                        <li><button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button></li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Slide-out Menu */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <ul>
                        <li><button onClick={() => scrollToSection('home')} className="mobile-nav-link">Home</button></li>
                        <li><button onClick={() => scrollToSection('about')} className="mobile-nav-link">About</button></li>
                        <li><button onClick={() => scrollToSection('projects')} className="mobile-nav-link">Projects</button></li>
                        <li><button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Contact</button></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
