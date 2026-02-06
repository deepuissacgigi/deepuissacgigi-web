import React, { useEffect, useRef, useState } from 'react';
import '../../index.scss';

// Detect touch devices
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const CustomCursor = () => {
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Refs for positions
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Disable on touch devices
        if (isTouchDevice()) return;

        setIsVisible(true);

        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            // Move dot instantly using GPU-accelerated transform
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        const onMouseOver = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' ||
                target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseover", onMouseOver, { passive: true });

        let animationFrameId;
        let lastTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;

        // Lerp function for smooth trailing
        const lerp = (start, end, factor) => start + (end - start) * factor;

        const updateCursor = (currentTime) => {
            // Throttle to 30fps
            if (currentTime - lastTime >= frameInterval) {
                lastTime = currentTime;

                if (cursorRingRef.current) {
                    ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.12);
                    ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.12);

                    const scale = isHovering ? 2.5 : 1;
                    cursorRingRef.current.style.transform =
                        `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
                }
            }
            animationFrameId = requestAnimationFrame(updateCursor);
        };

        animationFrameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseover", onMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering]);

    // Don't render on touch devices
    if (!isVisible) return null;

    return (
        <>
            <div
                ref={cursorDotRef}
                className="cursor-dot"
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#646cff',
                    willChange: 'transform'
                }}
            />
            <div
                ref={cursorRingRef}
                className="cursor-ring"
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    zIndex: 9998,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: isHovering ? '1px solid rgba(100, 108, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: isHovering ? 'rgba(100, 108, 255, 0.1)' : 'transparent',
                    willChange: 'transform'
                }}
            />
        </>
    );
};

export default CustomCursor;

