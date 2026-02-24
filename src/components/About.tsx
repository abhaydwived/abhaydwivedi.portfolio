import { useEffect } from 'react';

/**
 * About — highlight parallax scroll animation.
 * Logic extracted from landing.ts (highlight scroll tracking).
 * No JSX output — operates on existing `.highlight` elements.
 */
export function About(): null {
    useEffect(() => {
        const highlights = document.querySelectorAll('.highlight');
        type HighlightData = { hasStarted: boolean; startScroll: number; duration: number; direction: string };
        const highlightData = new Map<Element, HighlightData>();

        highlights.forEach((highlight, index) => {
            const direction = index % 2 === 0 ? 'left' : 'right';
            highlight.setAttribute('data-direction', direction);
            highlightData.set(highlight, {
                hasStarted: false,
                startScroll: 0,
                duration: 100,
                direction
            });
        });

        function updateHighlights() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            highlights.forEach(highlight => {
                const rect = highlight.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const data = highlightData.get(highlight)!;
                const triggerPoint = scrollY + windowHeight * 0.8;

                if (!data.hasStarted && triggerPoint >= elementTop) {
                    data.hasStarted = true;
                    data.startScroll = scrollY;
                }

                if (data.hasStarted) {
                    const progress = Math.min(1, Math.max(0, (scrollY - data.startScroll) / data.duration));
                    (highlight as HTMLElement).style.setProperty('--highlight-progress', `${progress * 100}%`);
                }

                if (data.hasStarted && scrollY < data.startScroll - 50) {
                    data.hasStarted = false;
                    (highlight as HTMLElement).style.setProperty('--highlight-progress', '0%');
                }
            });
        }

        if (highlights.length > 0) {
            window.addEventListener('scroll', updateHighlights);
            requestAnimationFrame(updateHighlights);
        }

        return () => {
            window.removeEventListener('scroll', updateHighlights);
        };
    }, []);

    return null;
}

export default About;
