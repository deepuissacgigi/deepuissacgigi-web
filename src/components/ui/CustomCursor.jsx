/**
 * CustomCursor.jsx - Custom Mouse Cursor
 * 
 * Features:
 * - Dot (instant) + Ring (trailing with lerp)
 * - Expands on hover over interactive elements
 * - Hidden on touch-only devices
 * - GPU-accelerated with transform3d
 */

import React, { useEffect, useRef, useState } from 'react';

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

/**
 * Detect touch-only devices (no mouse)
 */
const isTouchOnlyDevice = () => {
    return 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
};

/**
 * Linear interpolation for smooth animation
 */
const lerp = (start, end, factor) => start + (end - start) * factor;

/* ============================================
   CUSTOM CURSOR COMPONENT
   ============================================ */
const CustomCursor = () => {
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Position refs for animation loop
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const isHoveringRef = useRef(false);

    useEffect(() => {
        // Skip on touch-only devices
        if (isTouchOnlyDevice()) return;

        setIsVisible(true);
        ringPos.current = { x: -100, y: -100 };

        /**
         * Mouse move handler - moves dot instantly
         */
        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Dot follows instantly
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform =
                    `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        /**
         * Detect hover over interactive elements
         */
        const onMouseOver = (e) => {
            const target = e.target;
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]');

            isHoveringRef.current = isInteractive;
            setIsHovering(isInteractive);
        };

        /**
         * Hide cursor when mouse leaves window
         */
        const onMouseLeave = () => {
            if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
            if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
        };

        const onMouseEnter = () => {
            if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
            if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1';
        };

        // Event listeners
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseover", onMouseOver, { passive: true });
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mouseenter", onMouseEnter);

        let animationFrameId;

        /**
         * Animation loop - ring follows with smooth lerp
         */
        const updateCursor = () => {
            if (cursorRingRef.current) {
                // Lerp factor 0.15 for buttery smooth trailing
                ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
                ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

                const scale = isHoveringRef.current ? 2 : 1;

                cursorRingRef.current.style.transform =
                    `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
            }
            animationFrameId = requestAnimationFrame(updateCursor);
        };

        animationFrameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mouseenter", onMouseEnter);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Don't render on touch devices
    if (!isVisible) return null;

    /* ============================================
       CURSOR STYLES
       ============================================ */
    const dotStyle = {
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#646cff',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
    };

    const ringStyle = {
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: `1px solid ${isHovering ? 'rgba(100, 108, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'}`,
        backgroundColor: isHovering ? 'rgba(100, 108, 255, 0.1)' : 'transparent',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transition: 'border-color 0.2s, background-color 0.2s'
    };

    return (
        <>
            <div ref={cursorDotRef} style={dotStyle} />
            <div ref={cursorRingRef} style={ringStyle} />
        </>
    );
};

export default CustomCursor;
