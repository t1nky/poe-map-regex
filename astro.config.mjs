import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  site: 'https://t1nky.github.io',
  base: '/poe-map-regex',
  integrations: [tailwind(), alpinejs()]
});