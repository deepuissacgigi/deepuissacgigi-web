import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// Check if device is low-power (mobile/tablet)
const isLowPowerDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.matchMedia('(max-width: 768px)').matches;
};

const generateStars = (count, radius) => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
};

const Stars = ({ particleCount }) => {
    const ref = useRef();
    const sphere = useMemo(() => generateStars(particleCount, 1.5), [particleCount]);
    const frameCount = useRef(0);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Limit to ~30fps for performance
        frameCount.current++;
        if (frameCount.current % 2 !== 0) return;

        // Ultra-slow rotation
        ref.current.rotation.x -= delta / 150;
        ref.current.rotation.y -= delta / 200;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={2}
                />
            </Points>
        </group>
    );
};

const ThreeBackground = () => {
    const [shouldRender, setShouldRender] = useState(true);
    const particleCount = isLowPowerDevice() ? 800 : 1500;

    // Disable on reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setShouldRender(false);
        }
    }, []);

    if (!shouldRender) {
        return <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#000000' }} />;
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: '#000000' }}>
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={1} // Force 1x DPR for performance
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    alpha: false,
                    stencil: false,
                    depth: false
                }}
                frameloop="demand" // Only render when needed
                onCreated={({ gl, invalidate }) => {
                    gl.setClearColor('#000000');
                    // Continuous slow animation
                    const animate = () => {
                        invalidate();
                        requestAnimationFrame(animate);
                    };
                    // Throttle to 30fps
                    setInterval(() => invalidate(), 33);
                }}
            >
                <Stars particleCount={particleCount} />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;

