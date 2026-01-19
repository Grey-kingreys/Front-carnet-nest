import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      react(),
      tailwindcss(), // Ajoutez le plugin Tailwind v4 ici
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    server: {
      port: 5175,
      strictPort: true,
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'date-fns'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };

  if (mode === 'analyze') {
    config.plugins?.push(
      visualizer({
        gzipSize: true,
        brotliSize: true,
        open: true,
        filename: 'bundle-analyzer-report.html',
      })
    );
  }

  return config;
});