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
});
