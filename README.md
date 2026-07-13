# gabrielpeixoto-cvai.github.io

Personal academic website of Gabriel Peixoto de Carvalho, built with **Astro 5** and deployed to **GitHub Pages** via GitHub Actions.

## What this is

A static, trilingual (English, 日本語, Português-BR) academic site: publications, talks, teaching, portfolio/projects, blog, notes, and CV. Content is authored as Markdown in Astro **content collections**; the site is fully statically generated. Live at <https://gabrielpeixoto-cvai.github.io>.

## Tech stack

- **Astro 5** static site generator (`output: static`, `dist/`).
- **Content collections** (`src/content.config.ts`) with Zod-validated front-matter.
- **Trilingual i18n**: path-prefixed locales (`/en/`, `/ja/`, `/pt-br/`) with a silent English fallback; helpers in `src/i18n/`.
- **Sitemap** via `@astrojs/sitemap`; **MDX** via `@astrojs/mdx`.
- Deployed to **GitHub Pages** by `.github/workflows/deploy.yml` (builds and publishes `dist/` on every push to `master`).

## Local development

```bash
npm install      # install dependencies (Node >=20.3.0; see .nvmrc)
npm run dev      # start the dev server at http://localhost:4321
```

## Key commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the static site into `dist/`. |
| `npm run check` | Type-check with `astro check`. |
| `npm test` | Run Playwright smoke tests. |
| `npm run test:unit` | Run `node --test` unit tests (`scripts/`, `src/i18n/`). |
| `npm run new` | Scaffold a new content entry (interactive). |
| `npm run import:bib` | Import publications from a BibTeX file. |
| `npm run translate` | Generate `ja` / `pt-br` translations via the local Ollama pipeline. |

## Content layout

Author Markdown under `src/content/<collection>/` (e.g. `src/content/publications/`, `src/content/talks/`, `src/content/blog/`). English is the base file `<slug>.md`; a translation is `<slug>.<locale>.md` (`<slug>.ja.md`, `<slug>.pt-br.md`). Missing translations fall back to English automatically.

## More docs

- `docs/project-pages.md` — authoring rich project/portfolio pages.
- `scripts/README.md` — the authoring, BibTeX-import, and translation scripts.
- `docs/CUTOVER.md` — the one-time Jekyll→Astro cutover checklist.
