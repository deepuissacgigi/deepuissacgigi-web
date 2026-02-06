/**
 * NotFound.jsx - 404 Error Page
 * 
 * Displayed when user navigates to non-existent route
 */

import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.scss';

/* ============================================
   404 PAGE COMPONENT
   ============================================ */
const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found__content">
                {/* Error Code */}
                <div className="not-found__code">404</div>

                {/* Message */}
                <h1 className="not-found__title">Page Not Found</h1>
                <p className="not-found__description">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Navigation Buttons */}
                <div className="not-found__actions">
                    <Link to="/">
                        <Button variant="primary">
                            <Home size={18} />
                            Back to Home
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
