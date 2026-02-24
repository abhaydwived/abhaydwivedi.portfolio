import { useEffect } from 'react';

/**
 * Contact — IntersectionObserver fade-in for contact cards.
 * No JSX output — operates on existing `#contact .contact-card` elements.
 */
export function Contact(): null {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('#contact .contact-card').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return null;
}

export default Contact;
