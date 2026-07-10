# Authoring scripts

Utilities for creating site content. Pure logic lives in `scripts/lib/` (unit-tested with `npm run test:unit`); the `.mjs` entrypoints are thin CLIs.

## Create a new content file

    npm run new -- <type> "<title>"

Types and their target collection:

| type | collection | path |
|------|------------|------|
| `post` | blog | `src/content/blog/YYYY-MM-DD-<slug>.md` |
| `note` | notes | `src/content/notes/YYYY-MM-DD-<slug>.md` |
| `talk` | talks | `src/content/talks/YYYY-MM-DD-<slug>.md` |
| `teaching` | teaching | `src/content/teaching/YYYY-MM-DD-<slug>.md` |
| `publication` | publications | `src/content/publications/YYYY-MM-DD-<slug>.md` |
| `portfolio` | portfolio | `src/content/portfolio/<slug>.md` |

The generated front matter validates against the schema in `src/content.config.ts`. Optional URL fields (`paperurl`, `link`) are intentionally omitted — add them with a real URL when you have one (an empty URL fails validation). The command refuses to overwrite an existing file.

## Import publications from BibTeX

    npm run import:bib -- path/to/refs.bib

Creates one publication file per entry (skipping any that already exist), mapping title/year/venue/url and preserving the raw entry in the `bibtex` field. Then review each file and fill in the `citation` and abstract. Existing files are never overwritten.

## Tests

    npm run test:unit   # node --test over scripts/
