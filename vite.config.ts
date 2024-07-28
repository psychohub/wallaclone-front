import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      outDir: 'build',
    },
    server: {
      port: Number(env.PORT),
      proxy: {
        '/api': {
          target: String(env.VITE_API_URL),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        src: '/src',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "bootstrap/scss/bootstrap";`
        }
      }
    }
  };
});
