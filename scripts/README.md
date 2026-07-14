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

## Translate content

    npm run translate                          # ja + pt-br, Ollama provider (default)
    npm run translate -- --provider mock       # deterministic offline stub (no Ollama/network)
    npm run translate -- --locale ja           # a single locale (comma-separate for several)
    npm run translate -- --model qwen2.5:7b    # override the model for this run
    npm run translate -- --dry-run             # print planned actions without writing

For each English source `src/content/<coll>/<slug>.md`, this generates
`<slug>.ja.md` and `<slug>.pt-br.md`. **Only the `title`, `excerpt`, and the
Markdown body are translated;** every other front-matter field (`date`, `venue`,
`citation`, `tags`, `type`, `location`, `paperurl`, `image`, `link`, `bibtex`)
is copied verbatim.

**Caching:** each generated file records a `translationHash` of its English
source. On the next run an unchanged source is skipped (`skip (cached)`), so only
new or edited content is re-translated. Set `translationLocked: true` in a
translated file's front matter to protect a hand-edit — the pipeline will report
`skip (locked)` and never overwrite it. This is the main quality safeguard, since
local-MT output is a notch below a cloud LLM (most noticeably for Japanese).

The cache key is the English source content only — not the provider or model.
So switching `--model` and re-running reports `skip (cached)` and will not
re-translate; edit the source or delete the target `.ja.md`/`.pt-br.md` files to
force a re-run. Never leave `--provider mock` output on disk before a real run —
a later run would treat the `[ja] …` stub as cached.

### Running the Ollama engine (hands-on)

    docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
    docker exec ollama ollama pull qwen2.5:32b
    npm run translate            # generates ja + pt-br files; review, then commit

CPU-only or low VRAM: omit `--gpus=all` and use a smaller model, e.g.
`OLLAMA_MODEL=qwen2.5:7b npm run translate`. Host and model can also be set via
the `OLLAMA_HOST` and `OLLAMA_MODEL` environment variables (defaults:
`http://localhost:11434`, `qwen2.5:32b`).

**Always review generated files before committing**, and set
`translationLocked: true` on any file you hand-edit so a later run cannot clobber
your changes.

## Tests

    npm run test:unit   # node --test over scripts/
