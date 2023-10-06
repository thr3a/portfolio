import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { WorkData } from './src/data/works';

const urls = WorkData.map(x => x.url);

export default defineConfig({
  plugins: [
    react(),
    Sitemap({ dynamicRoutes: urls })
  ]
});
