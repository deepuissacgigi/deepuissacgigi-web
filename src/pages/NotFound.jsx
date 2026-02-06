/**
 * NotFound.jsx - 404 Error Page
 * 
 * Features:
 * - Falling Stars / Meteor Shower Animation
 * - Glitch text
 * - Cosmic theme
 */

import React, { useEffect, useRef } from 'react';
import { Home, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.scss';

/* ============================================
   FALLING STARS ANIMATION
   ============================================ */
const FallingStarsBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        };
        window.addEventListener('resize', resize);

        // Configuration
        const stars = [];
        const numStars = 150;
        const meteors = [];
        const numMeteors = 15; // Increased count slightly since asteroids are gone

        function createStar() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005
            };
        }

        function createMeteor() {
            // Smart Randomization
            // 1. Varied Speed: Some slow drifters, some fast shooters
            const speed = Math.random() * 2 + 1.0; // range 1.0 - 3.0 (Slower)

            // 2. Correlated Length: Faster meteors should have longer trails visually
            // Base length + speed multiplier + noise
            const length = (speed * 25) + (Math.random() * 30);

            // 3. Depth simulation: Smaller = further back = slightly slower (parallax feels)
            const size = Math.random() * 1.5 + 0.5;
            const parallaxSpeed = speed * (size / 2); // Slower if smaller

            return {
                x: Math.random() * width * 1.5 - width * 0.2,
                y: -(Math.random() * height * 3), // Initial delay
                size: size,
                speed: parallaxSpeed,
                length: length,
                angle: Math.PI / 4
            };
        }

        const initStars = () => {
            stars.length = 0;
            meteors.length = 0;
            for (let i = 0; i < numStars; i++) stars.push(createStar());
            for (let i = 0; i < numMeteors; i++) {
                const m = createMeteor();
                // Override Y for immediate visibility on load (spread across screen)
                m.y = Math.random() * height * 1.2 - height * 0.2;
                meteors.push(m);
            }
        };
        initStars();

        const animate = () => {
            // Clear
            ctx.fillStyle = '#050510';
            ctx.fillRect(0, 0, width, height);

            // 1. Draw Static Stars
            stars.forEach(s => {
                s.opacity += s.twinkleSpeed;
                if (s.opacity > 1 || s.opacity < 0.2) s.twinkleSpeed = -s.twinkleSpeed;
                ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 2. Draw Falling Meteors
            ctx.lineCap = 'round';
            meteors.forEach(m => {
                m.x -= m.speed * Math.cos(m.angle);
                m.y += m.speed * Math.sin(m.angle);

                // Respawn
                if (m.y > height + 100 || m.x < -100) {
                    // Re-randomize on respawn for variety
                    const newMeteor = createMeteor();
                    m.x = width + Math.random() * width * 0.5;
                    m.y = -(Math.random() * height * 2);
                    m.speed = newMeteor.speed;
                    m.length = newMeteor.length;
                    m.size = newMeteor.size;
                }

                const gradient = ctx.createLinearGradient(
                    m.x, m.y, m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle)
                );
                // Whiter head, blue-ish tail fade
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.2, 'rgba(200, 220, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(100, 108, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = m.size;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle));
                ctx.stroke();

                // Head glow
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="falling-stars-bg" />;
};

/* ============================================
   404 PAGE COMPONENT
   ============================================ */
const NotFound = () => {
    return (
        <div className="not-found">
            {/* Falling Stars Background */}
            <FallingStarsBackground />

            {/* Content */}
            <div className="not-found__content">
                {/* Glitch 404 */}
                <div className="not-found__code glitch" data-text="404">
                    404
                </div>

                {/* Message */}
                <h1 className="not-found__title">Page Not Found</h1>
                <p className="not-found__description">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                {/* Icon */}
                <div className="not-found__astronaut">
                    <svg width="80" height="60" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(100, 108, 255, 0.5))' }}>
                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="sans-serif" style={{ letterSpacing: '1px' }}>
                            DG.
                        </text>
                    </svg>
                </div>

                {/* Navigation */}
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
