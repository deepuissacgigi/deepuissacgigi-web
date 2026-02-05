import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
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

const Stars = (props) => {
    const ref = useRef();
    // Reduce count further to 2500 for deeper black look
    const sphere = useMemo(() => generateStars(2500, 1.5), []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Ultra-slow rotation (barely moving)
        ref.current.rotation.x -= delta / 150;
        ref.current.rotation.y -= delta / 200;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
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
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: '#000000' }}>
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 2]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                onCreated={({ gl }) => gl.setClearColor('#000000')}
            >
                <Stars />
            </Canvas>
        </div>
    );
};


export default ThreeBackground;
