import { useEffect } from 'react';

/**
 * Loader — handles the loading screen overlay hide animation.
 * Logic extracted from landing.ts (window 'load' event listener).
 * No JSX output — operates on the existing HTML `.loader-overlay` element.
 */
export function Loader(): null {
    useEffect(() => {
        const hideLoader = () => {
            const loader = document.querySelector('.loader-overlay');
            if (loader) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 1200);
            }
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
            return () => window.removeEventListener('load', hideLoader);
        }
    }, []);

    return null;
}

export default Loader;
