/**
 * LoadingScreen.jsx - Initial App Loading State
 * 
 * Features:
 * - Smooth progress bar animation
 * - Percentage counter
 * - Fade out transition on completion
 */

import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Smooth progress animation configuration
        const startTime = Date.now();
        const duration = 2000; // 2 seconds load time

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const nextProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(nextProgress);

            if (nextProgress < 100) {
                requestAnimationFrame(animate);
            } else {
                setIsLoaded(true);
                // Delay callback to allow fade-out animation to complete
                setTimeout(onComplete, 800);
            }
        };

        requestAnimationFrame(animate);
    }, [onComplete]);

    return (
        <div className={`minimal-loader ${isLoaded ? 'fade-out' : ''}`}>
            <div className="loader-content">
                {/* Progress Bar */}
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Percentage Text */}
                <div className="loader-status">
                    <span className="percentage">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
