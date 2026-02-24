
import * as L from 'leaflet';

export function initLandingPage() {
    // Always start at top of page on reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Loading Screen
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader-overlay');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1200);
        }
    });

    // Hero Photo Tilt on Scroll
    let photoTilted = false;
    const heroPhoto = document.querySelector('.hero-photo');

    window.addEventListener('scroll', () => {
        if (heroPhoto && !photoTilted && window.scrollY > 5) {
            heroPhoto.classList.add('tilted');
            photoTilted = true;
        }
    });

    if (heroPhoto) {
        heroPhoto.addEventListener('mouseenter', () => {
            heroPhoto.classList.remove('tilted');
        });

        heroPhoto.addEventListener('mouseleave', () => {
            if (photoTilted) {
                heroPhoto.classList.add('tilted');
            }
        });
    }

    // Falling SVG - Only terminal (top-right)
    let terminalFallen = false;
    const decoTerminal = document.querySelector('.deco-terminal') as HTMLElement;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;

    function calculateFallDistance() {
        if (!decoTerminal || !heroContent) return;
        const heroContentRect = heroContent.getBoundingClientRect();
        const heroContentBottom = heroContentRect.bottom;
        const terminalRect = decoTerminal.getBoundingClientRect();
        const terminalFall = Math.max(0, heroContentBottom - terminalRect.bottom - 50);
        decoTerminal.style.setProperty('--fall-distance', `${terminalFall}px`);
    }

    if (decoTerminal && heroContent) {
        calculateFallDistance();
        window.addEventListener('resize', calculateFallDistance);

        window.addEventListener('scroll', () => {
            if (!terminalFallen && window.scrollY > 5) {
                decoTerminal.classList.add('falling');
                terminalFallen = true;
            }
        });
    }

    // Paper Tear Gap Parallax Effect
    const pageGap = document.querySelector('.page-gap') as HTMLElement;
    const paperTearBottom = document.querySelector('.paper-tear-bottom') as HTMLElement;
    const paperTearBottomBgGray = document.querySelector('.paper-tear-bottom svg path[fill="#d0d0d0"]') as HTMLElement;
    const tearTapeSticker = document.querySelector('.tear-tape-sticker') as HTMLElement;
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

    // Highlight Parallax Effect
    const highlights = document.querySelectorAll('.highlight');
    const highlightData = new Map();

    highlights.forEach((highlight, index) => {
        const direction = index % 2 === 0 ? 'left' : 'right';
        highlight.setAttribute('data-direction', direction);
        highlightData.set(highlight, {
            hasStarted: false,
            startScroll: 0,
            duration: 100,
            direction: direction
        });
    });

    function updateHighlights() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        highlights.forEach(highlight => {
            const rect = highlight.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const data = highlightData.get(highlight);
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

    // Language Stars Parallax Effect
    const languageItems = document.querySelectorAll('.language-item');
    const languageStarsData = new Map();

    languageItems.forEach(item => {
        const stars = item.querySelectorAll('.language-stars .star');
        languageStarsData.set(item, {
            hasStarted: false,
            startScroll: 0,
            stars: stars,
            starDelay: 50
        });
    });

    function updateLanguageStars() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        languageItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const data = languageStarsData.get(item);
            const triggerPoint = scrollY + windowHeight * 0.8;

            if (!data.hasStarted && triggerPoint >= elementTop) {
                data.hasStarted = true;
                data.startScroll = scrollY;
            }

            if (data.hasStarted) {
                const scrollProgress = scrollY - data.startScroll;
                data.stars.forEach((star: any, index: number) => {
                    if (scrollProgress >= index * data.starDelay) {
                        star.classList.add('visible');
                    }
                });
            }
        });
    }

    if (languageItems.length > 0) {
        window.addEventListener('scroll', updateLanguageStars);
        requestAnimationFrame(updateLanguageStars);
    }

    // Journey Timeline Book Page Effect
    const journeyTimeline = document.querySelector('.journey-timeline') as HTMLElement;
    const journeyTimelineBack = document.querySelector('.journey-timeline-back') as HTMLElement;
    const journeyTimelineData = {
        hasStarted: false,
        startScroll: 0,
        pageRange: 200
    };

    function updateJourneyTimeline() {
        if (!journeyTimeline || !journeyTimelineBack) return;
        if (window.innerWidth < 769) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const rect = journeyTimeline.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const triggerPoint = scrollY + windowHeight * 0.5;

        if (!journeyTimelineData.hasStarted && triggerPoint >= elementTop) {
            journeyTimelineData.hasStarted = true;
            journeyTimelineData.startScroll = scrollY;
        }

        if (journeyTimelineData.hasStarted) {
            const progress = Math.min(1, Math.max(0, (scrollY - journeyTimelineData.startScroll) / journeyTimelineData.pageRange));
            const rotateY = 180 - (180 * progress);
            journeyTimeline.style.transform = `rotateY(${rotateY}deg)`;
            journeyTimelineBack.style.transform = `rotateY(${rotateY}deg)`;

            if (rotateY > 95) {
                journeyTimeline.style.zIndex = '1';
                journeyTimelineBack.style.zIndex = '100';
            } else {
                journeyTimeline.style.zIndex = '100';
                journeyTimelineBack.style.zIndex = '1';
            }
            journeyTimeline.style.overflowY = progress >= 1 ? 'auto' : 'hidden';
        } else {
            journeyTimeline.style.transform = 'rotateY(180deg)';
            journeyTimelineBack.style.transform = 'rotateY(180deg)';
            journeyTimeline.style.zIndex = '1';
            journeyTimelineBack.style.zIndex = '100';
            journeyTimeline.style.overflowY = 'hidden';
        }
    }

    if (journeyTimeline) {
        window.addEventListener('scroll', updateJourneyTimeline);
        requestAnimationFrame(updateJourneyTimeline);
    }

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

        themeToggle.addEventListener('click', () => {
            const theme = body.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

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

    // Smart Navbar Scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('navbar-hidden');
        } else if (currentScroll < lastScroll) {
            navbar.classList.remove('navbar-hidden');
        }

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
    });

    // Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .timeline-item, .skill-box').forEach(el => {
        observer.observe(el);
    });

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
    setTimeout(matrixTypingEffect, 500);

    // Journey Map with Leaflet
    const mapEl = document.getElementById('journey-map');
    if (mapEl) {
        const initialView = { center: [20.5937, 78.9629] as L.LatLngExpression, zoom: 4 };
        const map = L.map('journey-map', {
            center: initialView.center,
            zoom: initialView.zoom,
            scrollWheelZoom: false,
            zoomControl: true
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const locations = [
            {
                coords: [17.3850, 76.8196] as L.LatLngExpression,
                country: 'India',
                city: 'Kalaburagi',
                companies: [
                    {
                        city: 'Karnataka',
                        company: 'Central University of Karnataka',
                        period: '2023 - Present',
                        role: 'B.Tech Mathematics & Computing'
                    }
                ]
            },
            {
                coords: [26.4499, 80.3319] as L.LatLngExpression,
                country: 'India',
                city: 'Kanpur',
                companies: [
                    {
                        city: 'Uttar Pradesh',
                        company: 'Kendriya Vidyalaya Mati',
                        period: '2023',
                        role: 'Intermediate'
                    }
                ]
            },
            {
                coords: [31.5892, 76.9182] as L.LatLngExpression,
                country: 'India',
                city: 'Mandi',
                companies: [
                    {
                        city: 'Himachal Pradesh',
                        company: 'IIT Mandi',
                        period: 'May 2025 - Dec 2025',
                        role: 'Research Intern (RL)'
                    }
                ]
            },
            {
                coords: [12.9716, 77.5946] as L.LatLngExpression,
                country: 'India',
                city: 'Bangalore',
                companies: [
                    {
                        city: 'Karnataka',
                        company: 'Upcoming Opportunities',
                        period: 'Future',
                        role: 'ML Engineer'
                    }
                ]
            }
        ];

        const markers: { [key: string]: L.Marker } = {};

        locations.forEach(location => {
            const isCurrent = location.city === 'Kalaburagi';
            const markerIcon = L.divIcon({
                className: isCurrent ? 'neo-marker neo-marker-current' : 'neo-marker',
                html: `
                    <div class="neo-marker-label ${isCurrent ? 'neo-marker-label-current' : ''}">${location.city}</div>
                    <div class="neo-marker-pin ${isCurrent ? 'neo-marker-pin-current' : ''}"></div>
                `,
                iconSize: isCurrent ? [24, 24] : [20, 20],
                iconAnchor: isCurrent ? [12, 34] : [10, 30],
                popupAnchor: [0, isCurrent ? -34 : -30]
            });

            let popupContent = `<div class="map-popup">`;
            popupContent += `<div class="map-popup-country">${location.city}, ${location.country}</div>`;
            location.companies.forEach((company, index) => {
                if (index > 0) popupContent += `<div class="map-popup-divider"></div>`;
                popupContent += `
                    <div class="map-popup-company">
                        <strong>${company.company}</strong>
                        <span>${company.role}</span>
                        <small>${company.city}</small>
                        <small>${company.period}</small>
                    </div>
                `;
            });
            popupContent += `</div>`;

            const marker = L.marker(location.coords, { icon: markerIcon }).addTo(map);
            marker.bindPopup(popupContent);
            markers[location.city.toLowerCase()] = marker;
        });

        document.querySelectorAll('.timeline-item-flat').forEach(item => {
            item.addEventListener('click', () => {
                const city = item.getAttribute('data-country');
                if (city) {
                    const marker = markers[city.toLowerCase()];
                    if (marker) {
                        map.setView(marker.getLatLng(), 6, { animate: true, duration: 1 });
                        setTimeout(() => marker.openPopup(), 500);
                    }
                }
            });
        });
    }

    // Progress Bar Functionality
    const progressBarFill = document.querySelector('.progress-bar-fill') as HTMLElement;
    const checkpoints = document.querySelectorAll('.checkpoint');

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

    if (checkpoints.length > 0) {
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
    }
}

document.addEventListener('DOMContentLoaded', initLandingPage);
