import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart, registerables, type ChartConfiguration } from 'chart.js';

Chart.register(...registerables);
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SkillChartConfig {
    labels: string[];
    data: number[];
    colors: string[];
}

// ---------------------------------------------------------------------------
// Internal class — same logic as dashboard.ts CloudDashboard, TypeScript-typed
// ---------------------------------------------------------------------------
class CloudDashboard {
    private performanceChart: Chart | null = null;
    [key: string]: unknown; // allows dynamic chart properties

    constructor() {
        this.setupInitialAnimations();
        this.setupEventListeners();
        this.initializeScrollAnimations();
        this.initializeCharts();
        this.animateCounters();
        this.animateProgressBars();
    }

    private setupInitialAnimations() {
        gsap.from('.profile-avatar', { duration: 1, scale: 0, rotation: 360, ease: 'bounce.out', delay: 0.2 });
        gsap.from('.profile-info', { duration: 0.8, x: -50, opacity: 0, ease: 'power2.out', delay: 0.5 });
        gsap.from('.header-stats .stat-item', { duration: 0.6, y: 30, opacity: 0, stagger: 0.1, ease: 'power2.out', delay: 0.8 });
        gsap.from('.header-actions .btn', { duration: 0.5, scale: 0.8, opacity: 0, stagger: 0.1, ease: 'back.out(1.7)', delay: 1.2 });
        gsap.from('.nav-tab', { duration: 0.4, y: -20, opacity: 0, stagger: 0.05, ease: 'power2.out', delay: 1.5 });
    }

    private setupEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tabName = target.dataset.tab;
                if (tabName) this.switchTab(tabName);
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.smoothScroll(e as MouseEvent));
        });

        this.addHoverEffects();
        window.addEventListener('resize', () => this.resizeCharts());
    }

    private initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.animateCard(entry.target as HTMLElement);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.dashboard-card, .project-card, .education-card, .timeline-item').forEach(card => {
            observer.observe(card);
        });
    }

    private animateCard(card: HTMLElement) {
        gsap.from(card, { duration: 0.6, y: 50, opacity: 0, scale: 0.95, ease: 'power2.out' });
    }

    private switchTab(tabName: string) {
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(tabName)?.classList.add('active');

        gsap.from(`#${tabName}`, { duration: 0.5, y: 20, opacity: 0, ease: 'power2.out' });

        if (tabName === 'skills') {
            setTimeout(() => this.initializeCharts(), 100);
            setTimeout(() => this.animateProgressBars(), 200);
        }
    }

    animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            gsap.from(counter, {
                duration: 2,
                innerHTML: 0,
                snap: { innerHTML: 1 },
                ease: 'power2.out',
                delay: 1.8
            });
        });
    }

    animateProgressBars() {
        document.querySelectorAll('.progress').forEach(progressBar => {
            const width = (progressBar as HTMLElement).dataset.width;
            gsap.to(progressBar, { duration: 1.5, width: `${width}%`, ease: 'power2.out', delay: 0.2 });
        });
    }

    initializeCharts() {
        this.createPerformanceChart();
        this.createSkillsCharts();
    }

    private createPerformanceChart() {
        const canvas = document.getElementById('performanceChart') as HTMLCanvasElement | null;
        if (!canvas) return;
        if (this.performanceChart) (this.performanceChart as Chart).destroy();

        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Performance Score',
                    data: [65, 78, 82, 87, 91, 95],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } },
                    x: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } }
                }
            }
        };
        this.performanceChart = new Chart(canvas, config);
    }

    private createSkillsCharts() {
        this.createSkillChart('cloudSkillsChart', {
            labels: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
            data: [90, 95, 75, 85],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });
        this.createSkillChart('programmingSkillsChart', {
            labels: ['JavaScript', 'Python', 'Java', 'Go'],
            data: [95, 90, 80, 70],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });
        this.createSkillChart('frameworksSkillsChart', {
            labels: ['React', 'Node.js', 'Django', 'Spring'],
            data: [95, 90, 85, 75],
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        });
    }

    private createSkillChart(canvasId: string, config: SkillChartConfig) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
        if (!canvas) return;
        if (this[canvasId]) (this[canvasId] as Chart).destroy();

        this[canvasId] = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.colors,
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                // @ts-ignore
                cutout: '60%'
            }
        });
    }

    private addHoverEffects() {
        document.querySelectorAll('.dashboard-card, .project-card, .education-card, .cert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { duration: 0.3, y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { duration: 0.3, y: 0, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', ease: 'power2.out' });
            });
        });

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => gsap.to(btn, { duration: 0.2, scale: 1.05, ease: 'power2.out' }));
            btn.addEventListener('mouseleave', () => gsap.to(btn, { duration: 0.2, scale: 1, ease: 'power2.out' }));
        });

        document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => gsap.to(tag, { duration: 0.2, scale: 1.1, ease: 'back.out(1.7)' }));
            tag.addEventListener('mouseleave', () => gsap.to(tag, { duration: 0.2, scale: 1, ease: 'power2.out' }));
        });

        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.activity-icon');
                if (icon) gsap.to(icon, { duration: 0.3, rotation: 360, scale: 1.1, ease: 'power2.out' });
            });
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.activity-icon');
                if (icon) gsap.to(icon, { duration: 0.3, rotation: 0, scale: 1, ease: 'power2.out' });
            });
        });
    }

    private smoothScroll(e: MouseEvent) {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            if (target) {
                gsap.to(window, { duration: 1, scrollTo: target, ease: 'power2.inOut' });
            }
        }
    }

    resizeCharts() {
        if (this.performanceChart) (this.performanceChart as Chart).resize();
        Object.keys(this).forEach(key => {
            if (key.includes('Chart') && this[key] && typeof (this[key] as Chart).resize === 'function') {
                (this[key] as Chart).resize();
            }
        });
    }

    destroy() {
        if (this.performanceChart) (this.performanceChart as Chart).destroy();
        Object.keys(this).forEach(key => {
            if (key.includes('Chart') && this[key] && typeof (this[key] as Chart).destroy === 'function') {
                (this[key] as Chart).destroy();
            }
        });
    }
}

// ---------------------------------------------------------------------------
// React component wrapper
// ---------------------------------------------------------------------------

/**
 * Dashboard — GSAP animations, Chart.js charts, tab switching.
 * Converted from dashboard.ts `CloudDashboard` class.
 * No JSX output — operates on existing `abhay.html` DOM elements.
 */
export function Dashboard(): null {
    useEffect(() => {
        const dashboard = new CloudDashboard();
        return () => dashboard.destroy();
    }, []);

    return null;
}

export default Dashboard;
