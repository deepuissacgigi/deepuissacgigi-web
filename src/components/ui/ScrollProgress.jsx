import React, { useState, useEffect } from 'react';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;

            setScrollProgress(Number(scroll));
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 10000
        }}>
            <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #646cff, #a5b4fc)',
                width: `${scrollProgress * 100}%`,
                boxShadow: '0 0 10px rgba(100, 108, 255, 0.5)',
                transition: 'width 0.1s ease-out'
            }} />
        </div>
    );
};

export default ScrollProgress;
