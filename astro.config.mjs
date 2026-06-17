// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Build provenance — the exact deployed commit + date, surfaced in the
// footer. The build runs inside a git checkout (locally and on Cloudflare),
// so this resolves to the real SHA; falls back to 'dev' if git is absent.
const commit = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
})();
const buildDate = new Date().toISOString().slice(0, 10);

// https://astro.build/config
export default defineConfig({
  // Canonical origin — sitemap, RSS, canonical URLs, and OG tags derive from it.
  site: 'https://joel-mathew-thomas.devsecop.workers.dev',

  vite: {
    define: {
      'import.meta.env.PUBLIC_COMMIT': JSON.stringify(commit),
      'import.meta.env.PUBLIC_BUILD_DATE': JSON.stringify(buildDate),
    },
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
