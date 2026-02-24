import { useEffect } from 'react';

/**
 * ProgressBar — scroll progress bar with section checkpoints.
 * Logic extracted from landing.ts `updateProgressBar()` and checkpoint click handlers.
 * No JSX output — operates on the existing HTML `.progress-bar-fill` / `.checkpoint` elements.
 */
export function ProgressBar(): null {
    useEffect(() => {
        const progressBarFill = document.querySelector('.progress-bar-fill') as HTMLElement | null;
        const checkpoints = document.querySelectorAll('.checkpoint');

        if (checkpoints.length === 0) return;

        function updateProgressBar() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;

            if (progressBarFill) progressBarFill.style.width = progress + '%';

            const sections = ['hero', 'about', 'experience', 'skills', 'contact'];
            let activeIndex = 0;

            sections.forEach((sectionId, index) => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                        activeIndex = index;
                    }
                }
            });

            checkpoints.forEach((checkpoint, index) => {
                if (index <= activeIndex) {
                    checkpoint.classList.add('active');
                } else {
                    checkpoint.classList.remove('active');
                }
            });
        }

        checkpoints.forEach(checkpoint => {
            checkpoint.addEventListener('click', () => {
                const sectionId = checkpoint.getAttribute('data-section');
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        window.addEventListener('scroll', updateProgressBar);
        window.addEventListener('resize', updateProgressBar);
        updateProgressBar();

        return () => {
            window.removeEventListener('scroll', updateProgressBar);
            window.removeEventListener('resize', updateProgressBar);
        };
    }, []);

    return null;
}

export default ProgressBar;
