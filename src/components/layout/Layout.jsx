/**
 * Layout.jsx - Main Page Layout Wrapper
 * 
 * Provides consistent structure:
 * - Header (navigation)
 * - Main content area
 * - Footer
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="site-wrapper">
            <Header />
            <main className="site-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
