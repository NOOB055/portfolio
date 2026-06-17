# joel.thomas — portfolio

[![ci](https://github.com/NOOB055/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/NOOB055/portfolio/actions/workflows/ci.yml)

Source for my personal site: **https://joel-mathew-thomas.devsecop.workers.dev**

DevSecOps engineer — secure, compliant infrastructure for finance and
healthcare. This repo is itself a portfolio piece: the site is built and
operated with the same discipline I bring to production platforms.

## Stack

- **[Astro 6](https://astro.build)** — static output, zero JS by default;
  the only client-side script is the scroll-driven pipeline visualizer
  (GSAP, code-split to the homepage)
- **Tailwind CSS v4** — CSS-first config; all colors flow from semantic
  OKLCH design tokens (see the living [style guide](https://joel-mathew-thomas.devsecop.workers.dev/styleguide))
- **Content collections** — blog, work, and certifications are local
  MDX/YAML validated by Zod schemas at build time

## Architecture notes

- **Content is GitOps.** Every content change is a commit; CI + schema
  validation act as admission control. Invalid frontmatter fails the
  build — bad content cannot reach production.
- **Drafts can't leak.** `draft: true` posts are previewable in `npm run
  dev`, excluded from builds, and a permanent draft canary in the repo
  guards the filter.
- **Strict CSP, automated.** A post-build script hashes every inline
  script and writes the Content-Security-Policy into `dist/_headers` —
  no `unsafe-inline` for scripts, no hand-maintained hashes.
- **Supply-chain hygiene.** GitHub Actions are pinned to commit SHAs;
  the CI token is read-only.
- **Theme without flash.** Dark/light mode is decided by an inline
  script before first paint; tokens flip via one `data-theme` attribute.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # static build + CSP generation -> dist/
npx astro check  # type-check (strictest preset)
npm run og       # regenerate the OpenGraph card
```

## Content workflow

| To add… | Do this |
|---|---|
| Blog post | `src/content/blog/<slug>.mdx` with `title/description/pubDate` frontmatter |
| Work entry | `src/content/achievements/<slug>.mdx` (`featured: true` surfaces it on the homepage) |
| Certification | `src/content/certifications/<slug>.yaml` |

Push to `main` → CI gates → Cloudflare builds and deploys to the edge.

## Self-hosting

The same site runs anywhere as a container:

```bash
docker build -t portfolio .
docker run -p 8080:80 portfolio
```

Multi-stage build; final image is nginx-alpine serving static files with
sane cache and security headers.
