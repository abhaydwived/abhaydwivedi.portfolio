import { useEffect } from 'react';

/**
 * Projects — IntersectionObserver fade-in for project cards.
 * Pure structural section.
 * No JSX output — operates on existing `#projects .skill-box` elements.
 */
export function Projects(): null {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('#projects .skill-box').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
}

export default Projects;
