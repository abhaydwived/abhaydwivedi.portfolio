import { useEffect } from 'react';

/**
 * Hero — hero section scroll interactions.
 * Handles: photo tilt on scroll, falling SVG terminal, paper tear parallax,
 * and the matrix typing effect on `#hero-greeting`.
 * Logic extracted from landing.ts.
 * No JSX output — operates on existing HTML elements.
 */
export function Hero(): null {
    useEffect(() => {
        // Always start at top of page on reload
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Hero Photo Tilt on Scroll
        let photoTilted = false;
        const heroPhoto = document.querySelector('.hero-photo');

        const onPhotoScroll = () => {
            if (heroPhoto && !photoTilted && window.scrollY > 5) {
                heroPhoto.classList.add('tilted');
                photoTilted = true;
            }
        };
        window.addEventListener('scroll', onPhotoScroll);

        if (heroPhoto) {
            heroPhoto.addEventListener('mouseenter', () => {
                heroPhoto.classList.remove('tilted');
            });
            heroPhoto.addEventListener('mouseleave', () => {
                if (photoTilted) heroPhoto.classList.add('tilted');
            });
        }

        // Falling SVG — terminal (top-right)
        let terminalFallen = false;
        const decoTerminal = document.querySelector('.deco-terminal') as HTMLElement | null;
        const heroContent = document.querySelector('.hero-content') as HTMLElement | null;

        function calculateFallDistance() {
            if (!decoTerminal || !heroContent) return;
            const heroContentRect = heroContent.getBoundingClientRect();
            const heroContentBottom = heroContentRect.bottom;
            const terminalRect = decoTerminal.getBoundingClientRect();
            const terminalFall = Math.max(0, heroContentBottom - terminalRect.bottom - 50);
            decoTerminal.style.setProperty('--fall-distance', `${terminalFall}px`);
        }

        const onTerminalScroll = () => {
            if (!terminalFallen && window.scrollY > 5) {
                decoTerminal?.classList.add('falling');
                terminalFallen = true;
            }
        };

        if (decoTerminal && heroContent) {
            calculateFallDistance();
            window.addEventListener('resize', calculateFallDistance);
            window.addEventListener('scroll', onTerminalScroll);
        }

        // Paper Tear Gap Parallax Effect
        const pageGap = document.querySelector('.page-gap') as HTMLElement | null;
        const paperTearBottom = document.querySelector('.paper-tear-bottom') as HTMLElement | null;
        const paperTearBottomBgGray = document.querySelector('.paper-tear-bottom svg path[fill="#d0d0d0"]') as HTMLElement | null;
        const tearTapeSticker = document.querySelector('.tear-tape-sticker') as HTMLElement | null;
        const minGapHeight = -30;

        function updateTapePosition() {
            if (paperTearBottom && tearTapeSticker) {
                const rect = paperTearBottom.getBoundingClientRect();
                tearTapeSticker.style.setProperty('--tape-position', `${rect.top}px`);
            }
        }

        function updateGapParallax() {
            if (!pageGap || !paperTearBottom) return;
            const isMobile = window.innerWidth <= 768;
            if (isMobile) return;

            const scrollY = window.scrollY;
            const initialGapHeight = 300;
            const scrollStart = 100;
            const scrollRange = 200;
            const stickerDelay = 30;
            const stickerStart = scrollStart + scrollRange + stickerDelay;
            const stickerRange = 60;

            updateTapePosition();

            if (scrollY <= scrollStart) {
                pageGap.style.setProperty('height', initialGapHeight + 'px', 'important');
                paperTearBottom.style.setProperty('margin-top', '0px', 'important');
                if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '1';
                if (tearTapeSticker) {
                    tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)';
                    tearTapeSticker.style.opacity = '0';
                }
            } else if (scrollY >= scrollStart && scrollY <= scrollStart + scrollRange) {
                const progress = (scrollY - scrollStart) / scrollRange;
                const currentHeight = initialGapHeight - (initialGapHeight - minGapHeight) * progress;
                if (currentHeight >= 0) {
                    pageGap.style.setProperty('height', currentHeight + 'px', 'important');
                    paperTearBottom.style.setProperty('margin-top', '0px', 'important');
                    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '1';
                    if (tearTapeSticker) {
                        tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-100px) translateZ(50px) rotateX(45deg)';
                        tearTapeSticker.style.opacity = '0';
                    }
                } else {
                    pageGap.style.setProperty('height', '0px', 'important');
                    paperTearBottom.style.setProperty('margin-top', currentHeight + 'px', 'important');
                    const negativePart = Math.abs(minGapHeight);
                    const negativeProgress = Math.abs(currentHeight) / negativePart;
                    const opacity = 1 - negativeProgress;
                    if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = opacity.toString();
                }
            } else if (scrollY > stickerStart && scrollY < stickerStart + stickerRange) {
                pageGap.style.setProperty('height', '0px', 'important');
                paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
                if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';
                if (tearTapeSticker) {
                    const stickerProgress = (scrollY - stickerStart) / stickerRange;
                    const translateY = -40 + (40 * stickerProgress);
                    const translateZ = 30 - (30 * stickerProgress);
                    const rotateX = 35 - (35 * stickerProgress);
                    const opacityVal = Math.min(1, Math.max(0, (stickerProgress - 0.35) * 1.54));
                    tearTapeSticker.style.transform = `rotate(-8deg) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg)`;
                    tearTapeSticker.style.opacity = opacityVal.toString();
                }
            } else if (scrollY >= stickerStart + stickerRange) {
                pageGap.style.setProperty('height', '0px', 'important');
                paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
                if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';
                if (tearTapeSticker) {
                    tearTapeSticker.style.transform = 'rotate(-8deg) translateY(0px) translateZ(0px) rotateX(0deg)';
                    tearTapeSticker.style.opacity = '1';
                }
            } else {
                pageGap.style.setProperty('height', '0px', 'important');
                paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
                if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';
                if (tearTapeSticker) {
                    tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)';
                    tearTapeSticker.style.opacity = '0';
                }
            }
        }

        if (pageGap && paperTearBottom) {
            window.addEventListener('scroll', updateGapParallax);
            window.addEventListener('resize', updateGapParallax);
            requestAnimationFrame(updateGapParallax);
        }

        // Matrix Typing Effect for Hero Greeting
        const greetingElement = document.getElementById('hero-greeting');
        const finalText = 'Hi there! 👋';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

        function matrixTypingEffect() {
            if (!greetingElement) return;
            let iterations = 0;
            const interval = setInterval(() => {
                greetingElement.textContent = finalText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) return finalText[index];
                        if (char === ' ' || char === '👋') return char;
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                if (iterations >= finalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 50);
        }
        const matrixTimer = setTimeout(matrixTypingEffect, 500);

        // Intersection Observer for fade-in
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('fade-in');
            });
        }, observerOptions);

        document.querySelectorAll('.section, .timeline-item, .skill-box').forEach(el => {
            observer.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', onPhotoScroll);
            window.removeEventListener('scroll', onTerminalScroll);
            window.removeEventListener('resize', calculateFallDistance);
            window.removeEventListener('scroll', updateGapParallax);
            window.removeEventListener('resize', updateGapParallax);
            clearTimeout(matrixTimer);
            observer.disconnect();
        };
    }, []);

    return null;
}

export default Hero;
