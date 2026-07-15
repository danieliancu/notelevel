import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/marketing.css',
                'resources/js/marketing.js',
                'resources/css/canvas.css',
                'resources/js/canvas.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        // Without this, Vite's dev server binds to IPv6 `::1` by default on
        // some setups, and writes public/hot as `http://[::1]:5173`. Chrome
        // rejects that bracketed IPv6 literal as an invalid CSP source
        // expression outright, blocking every dev asset — binding to the
        // IPv4 loopback keeps the URL in a form CSP actually accepts.
        host: '127.0.0.1',
    },
});
