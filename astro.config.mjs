import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  integrations: [tailwind()],
});