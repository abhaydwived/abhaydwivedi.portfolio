import { useEffect } from 'react';

/**
 * Footer — IntersectionObserver fade-in for footer.
 * No JSX output — operates on existing `.footer` element.
 */
export function Footer(): null {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.05 });

        const footer = document.querySelector('.footer');
        if (footer) observer.observe(footer);

        return () => observer.disconnect();
    }, []);

    return null;
}

export default Footer;
