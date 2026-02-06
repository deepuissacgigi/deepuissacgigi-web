/**
 * NotFound.jsx - 404 Error Page
 * 
 * Features:
 * - Digital Rain Animation (Matrix-inspired but Cyber-Blue)
 * - Glitch text
 * - System Failure theme
 */

import React, { useEffect, useRef } from 'react';
import { Home, ArrowLeft, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.scss';

/* ============================================
   DIGITAL RAIN ANIMATION
   ============================================ */
const DigitalRainBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        // Setup
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Reset columns on resize
            initColumns();
        };
        window.addEventListener('resize', resize);

        // Configuration
        const fontSize = 16;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&<>[]{}';
        const colors = ['#646cff', '#818cf8', '#a78bfa', '#fff']; // Site colors

        let columns;
        let drops = []; // Y position of each drop

        const initColumns = () => {
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100; // Start above screen randomly
            }
        };
        initColumns();

        const animate = () => {
            // Semi-transparent black for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random char
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Color variation (Glitchy brights)
                const isBright = Math.random() > 0.95;
                ctx.fillStyle = isBright ? '#fff' : '#646cff'; // Mostly accent, some white hints
                if (Math.random() > 0.98) ctx.fillStyle = '#f43f5e'; // Rare red glitch

                // Draw
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop or move down
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="digital-rain-bg" />;
};

/* ============================================
   404 PAGE COMPONENT
   ============================================ */
const NotFound = () => {
    return (
        <div className="not-found">
            {/* Digital Rain Background */}
            <DigitalRainBackground />

            {/* Content */}
            <div className="not-found__content">
                {/* Glitch 404 */}
                <div className="not-found__code glitch" data-text="404">
                    404
                </div>

                {/* Message */}
                <h1 className="not-found__title">System Malfunction</h1>
                <p className="not-found__description">
                    Critical Error: The requested data segment could not be located in the memory bank.
                    <br />Rebooting reality sequence...
                </p>

                {/* Icon */}
                <div className="not-found__astronaut">
                    <Terminal size={48} />
                </div>

                {/* Navigation */}
                <div className="not-found__actions">
                    <Link to="/">
                        <Button variant="primary">
                            <Home size={18} />
                            System Reboot
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} />
                        Rollback
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
