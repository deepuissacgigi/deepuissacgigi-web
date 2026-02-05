import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Smooth progress animation
        const startTime = Date.now();
        const duration = 2000; // 2 seconds load

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const nextProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(nextProgress);

            if (nextProgress < 100) {
                requestAnimationFrame(animate);
            } else {
                setIsLoaded(true);
                setTimeout(onComplete, 800); // Fade out delay
            }
        };

        requestAnimationFrame(animate);
    }, [onComplete]);

    return (
        <div className={`minimal-loader ${isLoaded ? 'fade-out' : ''}`}>
            <div className="loader-content">


                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="loader-status">
                    <span className="percentage">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
