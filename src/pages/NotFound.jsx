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
        const numMeteors = 10;
        const asteroids = [];
        const numAsteroids = 1; // Exactly one per 10s

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
            return {
                x: Math.random() * width * 1.5 - width * 0.2,
                y: -(Math.random() * height * 3),
                size: Math.random() * 2 + 1,
                speed: Math.random() * 1.5 + 2,
                length: Math.random() * 80 + 20,
                angle: Math.PI / 4
            };
        }

        function createAsteroid() {
            // Create jagged shape
            const vertices = [];
            const numPoints = 6 + Math.floor(Math.random() * 4);
            for (let i = 0; i < numPoints; i++) vertices.push(0.7 + Math.random() * 0.3);

            // Speed logic for 10s loop
            // Avg screen diagonal ~1500px. Speed 3px/frame = 500 frames = ~8s travel.
            // Need gap. 
            const speed = 3;

            return {
                x: Math.random() * width * 0.8,
                y: -2000, // Initial delay
                size: 25,
                speed: speed,
                angle: Math.PI / 3, // Steep angle
                rotation: 0,
                rotSpeed: 0.02,
                vertices: vertices,
                tail: [] // Particle system for fire
            };
        }

        const initStars = () => {
            stars.length = 0;
            meteors.length = 0;
            asteroids.length = 0;
            for (let i = 0; i < numStars; i++) stars.push(createStar());
            for (let i = 0; i < numMeteors; i++) meteors.push(createMeteor());
            for (let i = 0; i < numAsteroids; i++) asteroids.push(createAsteroid());
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
                if (m.y > height + 100 || m.x < -100) {
                    m.x = width + Math.random() * width * 0.5;
                    m.y = -(Math.random() * height * 3);
                    m.speed = Math.random() * 1.5 + 2;
                }
                const gradient = ctx.createLinearGradient(
                    m.x, m.y, m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle)
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(1, 'rgba(100, 108, 255, 0)');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = m.size;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x + m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle));
                ctx.stroke();
            });

            // 3. Draw Fiery Asteroid
            asteroids.forEach(a => {
                // Determine screen presence (if far off screen, simple update)
                // If y < -300, it's waiting in delay. 

                a.x -= a.speed * Math.cos(a.angle);
                a.y += a.speed * Math.sin(a.angle);
                a.rotation += a.rotSpeed;

                // Reset logic (~10s approx)
                // Distance to respawn: travel time + delay.
                // Speed 3 -> 180px/sec. 10s = 1800px travel.
                if (a.y > height + 200 || a.x < -200) {
                    a.x = width * 0.5 + Math.random() * width * 0.5;
                    // To ensure ~10s interval:
                    // Reset to a position that takes 10s to reach 'visible' area again? 
                    // Or just add distance. 
                    a.y = -1800; // ~10s at speed 3
                }

                // Add Tail Particles (Fire/Smoke)
                // Spawn more particles if visible or close to visible
                if (a.y > -200 && a.y < height + 200) {
                    for (let i = 0; i < 10; i++) { // Higher density for voluminous tail
                        // Wider cone for "fireball" effect
                        const angleVar = (Math.random() - 0.5) * 0.8;
                        const speedVar = Math.random() * 3 + 2;

                        // Spawn at back of head
                        const r = a.size * 0.4;
                        const spawnAngle = a.angle + Math.PI + (Math.random() - 0.5) * 0.5;

                        a.tail.push({
                            x: a.x + Math.cos(spawnAngle) * r,
                            y: a.y + Math.sin(spawnAngle) * r,
                            vx: Math.cos(a.angle + Math.PI + angleVar) * speedVar,
                            vy: Math.sin(a.angle + Math.PI + angleVar) * speedVar,
                            drift: (Math.random() - 0.5) * 0.5, // More turbulence
                            life: 1.0,
                            decay: Math.random() * 0.015 + 0.01, // Longer life
                            size: Math.random() * 10 + 5, // Larger particles
                        });
                    }
                }

                // Update & Draw Tail
                a.tail.forEach((p, index) => {
                    p.x += p.vx + p.drift;
                    p.y += p.vy + p.drift;
                    p.life -= p.decay;
                    p.size *= 0.97;

                    if (p.life <= 0) {
                        a.tail.splice(index, 1);
                        return;
                    }

                    // Intense Fire Output
                    let color;
                    if (p.life > 0.8) color = `rgba(255, 255, 255, ${p.life})`; // White hot
                    else if (p.life > 0.6) color = `rgba(255, 255, 0, ${p.life * 0.8})`; // Yellow
                    else if (p.life > 0.3) color = `rgba(255, 100, 0, ${p.life * 0.6})`; // Orange/Red
                    else color = `rgba(100, 100, 100, ${p.life * 0.4})`; // Smoke

                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Draw Meteor Head (Glowing Orb instead of Rock)
                if (a.y > -100 && a.y < height + 100) {
                    ctx.save();
                    ctx.translate(a.x, a.y);

                    // Intense Glow
                    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, a.size * 3);
                    glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
                    glow.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
                    glow.addColorStop(0.5, 'rgba(255, 100, 50, 0.3)');
                    glow.addColorStop(1, 'rgba(255, 0, 0, 0)');

                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(0, 0, a.size * 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Solid Core
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(0, 0, a.size * 0.6, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
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
