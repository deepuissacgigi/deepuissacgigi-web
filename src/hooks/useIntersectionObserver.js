import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options = {}) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // Optional: Disconnect after first reveal if you want it to happen only once
                if (options.triggerOnce) {
                    observer.disconnect();
                }
            } else {
                if (!options.triggerOnce) {
                    setIsVisible(false);
                }
            }
        }, {
            threshold: 0.1, // Trigger when 10% visible
            ...options
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [options.triggerOnce, options.threshold]);

    return [elementRef, isVisible];
};

export default useIntersectionObserver;
