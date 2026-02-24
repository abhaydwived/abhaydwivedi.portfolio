import { useEffect } from 'react';

/**
 * Skills — IntersectionObserver fade-in for skill boxes.
 * Pure structural section — fade-in animation via observer.
 * No JSX output — operates on existing `.skill-box` elements.
 */
export function Skills(): null {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('#skills .skill-box').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
}

export default Skills;
