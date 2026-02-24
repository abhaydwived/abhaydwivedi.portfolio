/**
 * Central barrel export for all section-wise TSX components.
 * Import from here to use any component in the portfolio.
 *
 * Usage:
 *   import { Hero, Navbar, Dashboard } from './components';
 */

// Landing page sections (from landing.ts)
export { default as Loader } from './Loader';
export { default as ProgressBar } from './ProgressBar';
export { default as Navbar } from './Navbar';
export { default as Hero } from './Hero';
export { default as About } from './About';
export { default as Journey } from './Journey';
export { default as Skills } from './Skills';
export { default as Projects } from './Projects';
export { default as Education } from './Education';
export { default as Contact } from './Contact';
export { default as Footer } from './Footer';

// Separate page controllers
export { default as Dashboard } from './Dashboard';    // from dashboard.ts
export { default as Terminal } from './Terminal';      // from terminal.ts
export { default as RobbyResume } from './RobbyResume'; // from robby-main.ts
