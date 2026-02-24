import { useEffect } from 'react';
import * as L from 'leaflet';

/**
 * Journey — book-page flip animation, language stars, and Leaflet map.
 * Logic extracted from landing.ts.
 * No JSX output — operates on existing `.journey-timeline`, `#journey-map`,
 * `.language-item`, etc. elements.
 */
export function Journey(): null {
    useEffect(() => {
        // Journey Timeline Book Page Effect
        const journeyTimeline = document.querySelector('.journey-timeline') as HTMLElement | null;
        const journeyTimelineBack = document.querySelector('.journey-timeline-back') as HTMLElement | null;
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
                const progress = Math.min(1, Math.max(0,
                    (scrollY - journeyTimelineData.startScroll) / journeyTimelineData.pageRange
                ));
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

        // Language Stars Parallax Effect
        const languageItems = document.querySelectorAll('.language-item');
        type StarData = { hasStarted: boolean; startScroll: number; stars: NodeListOf<Element>; starDelay: number };
        const languageStarsData = new Map<Element, StarData>();

        languageItems.forEach(item => {
            const stars = item.querySelectorAll('.language-stars .star');
            languageStarsData.set(item, {
                hasStarted: false,
                startScroll: 0,
                stars,
                starDelay: 50
            });
        });

        function updateLanguageStars() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            languageItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const data = languageStarsData.get(item)!;
                const triggerPoint = scrollY + windowHeight * 0.8;

                if (!data.hasStarted && triggerPoint >= elementTop) {
                    data.hasStarted = true;
                    data.startScroll = scrollY;
                }

                if (data.hasStarted) {
                    const scrollProgress = scrollY - data.startScroll;
                    data.stars.forEach((star, index) => {
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

        // Journey Map with Leaflet
        const mapEl = document.getElementById('journey-map');
        let map: L.Map | null = null;

        if (mapEl) {
            const initialView = { center: [20.5937, 78.9629] as L.LatLngExpression, zoom: 4 };
            map = L.map('journey-map', {
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

                const marker = L.marker(location.coords, { icon: markerIcon }).addTo(map!);
                marker.bindPopup(popupContent);
                markers[location.city.toLowerCase()] = marker;
            });

            document.querySelectorAll('.timeline-item-flat').forEach(item => {
                item.addEventListener('click', () => {
                    const country = item.getAttribute('data-country');
                    if (country) {
                        const marker = markers[country];
                        if (marker && map) {
                            map.setView(marker.getLatLng(), 6, { animate: true, duration: 1 });
                            setTimeout(() => marker.openPopup(), 500);
                        }
                    }
                });
            });
        }

        return () => {
            window.removeEventListener('scroll', updateJourneyTimeline);
            window.removeEventListener('scroll', updateLanguageStars);
            if (map) map.remove();
        };
    }, []);

    return null;
}

export default Journey;
