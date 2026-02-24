import { useEffect } from 'react';

/**
 * Education — IntersectionObserver fade-in for education and languages section.
 * No JSX output — operates on existing `.education-card`, `.languages-card` elements.
 */
export function Education(): null {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.education-card, .languages-card').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
}

export default Education;
