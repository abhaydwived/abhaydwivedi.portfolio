import { useEffect } from 'react';

/**
 * Navbar — smart scroll hide/show, active nav-link tracking, smooth scroll, theme toggle.
 * Logic extracted from landing.ts.
 * No JSX output — operates on the existing HTML `.navbar` / `.nav-link` / `#theme-toggle` elements.
 */
export function Navbar(): null {
    useEffect(() => {
        // Smooth Scroll for Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Smart Navbar Scroll (hide on scroll-down, show on scroll-up)
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        const onScroll = () => {
            if (!navbar) return;
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.classList.add('navbar-hidden');
            } else if (currentScroll < lastScroll) {
                navbar.classList.remove('navbar-hidden');
            }

            // Active link tracking
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop - 100;
                const sectionHeight = (section as HTMLElement).offsetHeight;
                const sectionId = section.getAttribute('id');

                if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', onScroll);

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const body = document.body;
            const icon = themeToggle.querySelector('i');

            const updateIcon = (theme: string) => {
                if (!icon) return;
                if (theme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            };

            const currentTheme = localStorage.getItem('theme') || 'light';
            body.setAttribute('data-theme', currentTheme);
            updateIcon(currentTheme);

            const onThemeClick = () => {
                const theme = body.getAttribute('data-theme');
                const newTheme = theme === 'light' ? 'dark' : 'light';
                body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateIcon(newTheme);
            };

            themeToggle.addEventListener('click', onThemeClick);
            return () => {
                window.removeEventListener('scroll', onScroll);
                themeToggle.removeEventListener('click', onThemeClick);
            };
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return null;
}

export default Navbar;
