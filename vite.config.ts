import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                terminal: resolve(__dirname, 'terminal.html'),
                abhay: resolve(__dirname, 'abhay.html'),
                robby: resolve(__dirname, 'robby-resume.html')
            }
        }
    }
});
