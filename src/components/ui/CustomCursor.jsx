import React, { useEffect, useRef, useState } from 'react';
import '../../index.scss';

const CustomCursor = () => {
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Refs for positions
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            // Move dot instantly
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            }
        };

        const onMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseover", onMouseOver);

        let animationFrameId;

        // Lerp function for smooth trailing
        const lerp = (start, end, factor) => {
            return start + (end - start) * factor;
        };

        const updateCursor = () => {
            if (cursorRingRef.current) {
                // Smoothly move ring towards mouse position
                ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
                ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

                const x = ringPos.current.x;
                const y = ringPos.current.y;

                const scale = isHovering ? 2.5 : 1;

                cursorRingRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
                cursorRingRef.current.style.borderColor = isHovering ? "rgba(100, 108, 255, 0.8)" : "rgba(255, 255, 255, 0.5)";
                cursorRingRef.current.style.backgroundColor = isHovering ? "rgba(100, 108, 255, 0.1)" : "transparent";
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
                    backgroundColor: 'white',
                    mixBlendMode: 'difference'
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
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    transition: 'transform 0.1s linear, border-color 0.2s, background-color 0.2s',
                    mixBlendMode: 'difference'
                }}
            />
        </>
    );
};

export default CustomCursor;
