/**
 * NotFound.jsx - 404 Error Page
 * 
 * Features:
 * - "Gargantua" style Black Hole animation (Interstellar inspired)
 * - Simulates gravitational lensing and accretion disk
 * - Glitch text
 */

import React, { useEffect, useRef } from 'react';
import { Home, ArrowLeft, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.scss';

/* ============================================
   GARGANTUA BLACK HOLE ANIMATION
   ============================================ */
const GargantuaBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        // Dimensions
        let w, h, cx, cy;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            cx = w / 2;
            cy = h / 2;
        };
        resize();
        window.addEventListener('resize', resize);

        // Configuration
        const bhRadius = 80;    // Event Horizon radius
        const diskMin = 100;    // Inner edge of accretion disk
        const diskMax = 350;    // Outer edge
        const numParticles = 800;

        // Particles for Accretion Disk
        const particles = Array.from({ length: numParticles }, () => createParticle());

        function createParticle() {
            const angle = Math.random() * Math.PI * 2;
            // Distribute particles to form a disk
            // Weighted to be denser near the center
            const dist = diskMin + Math.random() * (diskMax - diskMin) * (Math.random() * 0.5 + 0.5);
            return {
                angle,
                dist,
                baseDist: dist,
                speed: 0.005 + (100 / dist) * 0.001, // Faster near center
                size: Math.random() * 2 + 1,
                // Color: Warm Gargantua shades (Orange/Gold/White) or Cyber (Blue/Violet)?
                // Let's go Cyber-Gargantua to match the site theme.
                color: `hsla(${220 + Math.random() * 40}, 100%, ${50 + Math.random() * 40}%, ${Math.random() * 0.8 + 0.2})`,
                z: Math.random() * 20 - 10, // Slight vertical variation
                freq: Math.random() * 0.02
            };
        }

        const animate = () => {
            // Dark trail effect
            ctx.fillStyle = 'rgba(5, 5, 8, 0.3)';
            ctx.fillRect(0, 0, w, h);

            // Sort particles by Z-index roughly (back to front) for "3D" feel
            // We simulate 3D rotation: Tilted disk
            const tilt = 0.2; // Tilt angle (radians)

            particles.sort((a, b) => {
                // Calculate projected Z for sorting (back of disk vs front)
                const zA = Math.sin(a.angle) * a.dist;
                const zB = Math.sin(b.angle) * b.dist;
                return zA - zB;
            });

            // Draw Black Hole Shadow (Draw it "in the middle" of particles? 
            // Actually Gargantua structure is: Back Disk -> Black Hole -> Front Disk)

            // 1. Draw "Lensing" halo (The light from the back disk bent over the top/bottom)
            // Simplified: Draw a glowing ring above/below
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#646cff'; // Blue glow

            // Draw particles!
            particles.forEach(p => {
                p.angle += p.speed;

                // 3D Projection
                // Flat disk tilted by `tilt`
                // x = dist * cos(angle)
                // y = dist * sin(angle) * sin(tilt) (flattened)
                // z = dist * sin(angle) * cos(tilt)

                const cosA = Math.cos(p.angle);
                const sinA = Math.sin(p.angle);

                let x = p.dist * cosA;
                let y = p.dist * sinA * 0.3; // Flattened Y
                const z = p.dist * sinA;     // Depth (negative is back, positive is front)

                // LENSING EFFECT (The "Gargantua" magic)
                // If particle is behind the black hole (z < 0), logic to bend it?
                // Visual hack: If it's behind, we map it to a ring *around* the black hole.

                let renderY = y;
                let renderX = x;

                // If massive gravity bends light: 
                // Light from BACK of disk (z < 0) appears curved UP/DOWN.
                // We'll split the particle drawing logic.

                // Scale based on perspective
                const scale = 1 + (z / 1000);

                ctx.fillStyle = p.color;
                ctx.globalAlpha = 1;

                if (z < -50) {
                    // BACK of disk - Gravitational Lensing!
                    // Draw these bent over the top/bottom
                    // Map x to arch over the hole

                    // Simple arch approximation:
                    // The closer to x=0 (center horizontal), the higher/lower it bends.
                    const distFactor = Math.abs(x) / (diskMax); // 0 at center, 1 at edge
                    const bend = (1 - distFactor) * 120; // Bend amount

                    // Draw TOP arch copy
                    ctx.beginPath();
                    ctx.arc(cx + x, cy - bend - 20, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw BOTTOM arch copy
                    ctx.beginPath();
                    ctx.arc(cx + x, cy + bend + 20, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                } else if (z > 0) {
                    // FRONT of disk - Just draw normally in front of hole
                    ctx.beginPath();
                    ctx.arc(cx + x, cy + y, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Always draw the main flattened disk (for fuller look)
                // Except clearly blocked by event horizon
                const distFromCenter = Math.sqrt(x * x + y * y);
                if (z > 0 || distFromCenter > bhRadius * 0.9) {
                    ctx.beginPath();
                    ctx.arc(cx + x, cy + y, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Draw Event Horizon (The Void) in the center (Always on top of back particles, behind front?)
            // We handled sorting, but canvas painting order is simple painter's algo.
            // To do it right: Draw Back Particles -> Draw Hole -> Draw Front Particles.
            // But we iterate once.

            // Workaround: Draw Black Hole in the middle of z-loop? 
            // Easier: Just draw a black circle with a glowing rim in a separate pass?
            // No, needs to occlude back.

            // Let's cheat: Draw a fixed black hole in center.
            // The "Back" lensed particles (arches) are drawn.
            // Then the BLACK HOLE disc.
            // Then the "Front" particles.

            // Reset
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        // Better loop with distinct render passes
        const renderLoop = () => {
            // 1. Clear
            ctx.fillStyle = '#000000'; // No trail, clean clear for precise geometry
            ctx.fillRect(0, 0, w, h);

            // 2. Stars
            ctx.fillStyle = '#FFF';
            for (let i = 0; i < 50; i++) {
                ctx.fillRect(
                    Math.random() * w,
                    Math.random() * h,
                    Math.random(), Math.random()
                );
            }

            // Update particles
            particles.forEach(p => p.angle += p.speed);

            // 3. Draw BACK Lensed Particles (The Halo)
            // Light from behind bent over/under
            ctx.globalCompositeOperation = 'screen'; // Glowy add
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4f46e5';

            particles.forEach(p => {
                const z = Math.sin(p.angle) * p.dist;
                if (z < 0) { // Behind
                    const x = p.dist * Math.cos(p.angle);
                    const distFactor = Math.abs(x) / p.dist;
                    // Bend curve: Higher in middle (x=0)
                    const bendY = (Math.cos((x / p.dist) * (Math.PI / 2))) * (bhRadius * 2.2);

                    // Top Arch
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(cx + x, cy - bendY, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Bottom Arch
                    ctx.beginPath();
                    ctx.arc(cx + x, cy + bendY, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // 4. Draw The Event Horizon (Shadow)
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowBlur = 30; // Glow around the hole itself
            ctx.shadowColor = '#818cf8';

            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
            ctx.fill();

            // Photon Ring (Inner bright ring)
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 5. Draw FRONT Accretion Disk (Crossing face)
            ctx.globalCompositeOperation = 'screen';
            ctx.shadowBlur = 8;
            particles.forEach(p => {
                const z = Math.sin(p.angle) * p.dist;
                if (z > 0) { // Front
                    const x = p.dist * Math.cos(p.angle);
                    const y = p.dist * Math.sin(p.angle) * 0.25; // Flattened

                    const scale = 1 + (z / 400);

                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(cx + x, cy + y, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            ctx.globalCompositeOperation = 'source-over';
            animationId = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="black-hole-bg" />;
};

/* ============================================
   404 PAGE COMPONENT
   ============================================ */
const NotFound = () => {
    return (
        <div className="not-found">
            {/* Gargantua Background */}
            <GargantuaBackground />

            {/* Content */}
            <div className="not-found__content">
                {/* Glitch 404 */}
                <div className="not-found__code glitch" data-text="404">
                    404
                </div>

                {/* Message */}
                <h1 className="not-found__title">Singularity Detected</h1>
                <p className="not-found__description">
                    You've ventured too close to Gargantua.
                    <br />Time dilation is in effect. 1 hour here is 7 years back home.
                </p>

                {/* Navigation */}
                <div className="not-found__actions">
                    <Link to="/">
                        <Button variant="primary">
                            <Home size={18} />
                            Initiate Docking
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} />
                        Slingshot Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
