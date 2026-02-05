

const Footer = () => {
    const year = new Date().getFullYear();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                {/* Brand Column */}
                <div className="footer-col brand-col">
                    <div className="footer-logo" onClick={() => scrollToSection('home')}>
                        <span className="logo-text">DG.</span>
                    </div>
                    <p className="footer-tagline">
                        Crafting digital experiences with precision and passion.
                    </p>
                </div>

                {/* Navigation Column */}
                <div className="footer-col nav-col">
                    <h4>Explore</h4>
                    <ul className="footer-links">
                        <li><button onClick={() => scrollToSection('home')}>Home</button></li>
                        <li><button onClick={() => scrollToSection('about')}>About</button></li>
                        <li><button onClick={() => scrollToSection('projects')}>Projects</button></li>
                        <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
                    </ul>
                </div>

                {/* Social/Connect Column */}
                <div className="footer-col social-col">
                    <h4>Connect</h4>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/in/deepuissacgigi/" target="_blank" rel="noopener noreferrer" className="social-link">
                            <span className="link-text">LinkedIn</span>
                            <span className="link-decoration"></span>
                        </a>
                        <a href="https://github.com/deepuissacgigi" target="_blank" rel="noopener noreferrer" className="social-link">
                            <span className="link-text">GitHub</span>
                            <span className="link-decoration"></span>
                        </a>
                        <a href="mailto:deepuissacgigi@gmail.com" className="social-link">
                            <span className="link-text">Email</span>
                            <span className="link-decoration"></span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {year} Deepu Issac Gigi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
