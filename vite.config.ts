import path from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    vitePrerenderPlugin({
      prerenderScript: path.resolve('./src/prerender.ts'),
      additionalPrerenderRoutes: ['/image-editor'],
      renderTarget: '#root'
    })
  ]
});
