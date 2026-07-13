# Authoring a project page

A **project page** is a per-paper page in the style of omniguide.github.io /
safediffuser.github.io: a hero (title, authors, teaser, link buttons), an
abstract, method figures, results tables, and a BibTeX block. This guide is
written so **any contributor — a developer, or an automated agent given a
paper's repository — can produce a working page from it alone**.

> **Note on languages:** project pages currently render in **English under every
> locale** (`/en/…`, `/ja/…`, `/pt-br/…`) via the site's silent English
> fallback. Translating project MDX is a later concern — you only author the
> English source.

## 1. Create the file

- Location: `src/content/projects/<slug>.mdx`
- The `<slug>` becomes the URL: `src/content/projects/omniguide.mdx` →
  `/<locale>/projects/omniguide/`.
- **The file must be `.mdx`** (the collection globs `**/*.mdx` only). A `.md`
  file in this directory is ignored.

## 2. Fill the front matter

Every field of the `projects` schema:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Paper / project title. |
| `authors` | list of `{ name, affiliation?, url? }` | yes | `affiliation`s are de-duplicated into numbered superscripts; `url` links the name. |
| `venue` | string | no | e.g. `"NeurIPS 2026"`. Shown as `venue · year`. |
| `date` | date (`YYYY-MM-DD`) | yes | Drives list ordering (newest first). |
| `teaserImage` | string | no | Path like `/images/foo.png` or an absolute URL. Shown in the hero if no `teaserVideo`. |
| `teaserVideo` | string | no | mp4 path/URL, or a YouTube/Vimeo URL. Takes priority over `teaserImage` in the hero. |
| `links` | list of `{ label, href }` | no | Hero buttons (Paper / Code / arXiv / Project). `href` must be an absolute URL. |
| `excerpt` | string | no | Short abstract — used on the index card and as the page meta description. |
| `bibtex` | string | no | Raw BibTeX; rendered in a copyable block. Use a YAML block scalar (`bibtex: |`). |
| `translationHash`, `translationLocked` | — | no | Managed by the translation pipeline; leave unset. |

Example:

```yaml
---
title: "My Paper Title"
authors:
  - name: "First Author"
    affiliation: "University A"
    url: "https://example.org/first"
  - name: "Second Author"
    affiliation: "Lab B"
venue: "CVPR 2026"
date: 2026-03-01
teaserImage: "/images/my-teaser.png"
links:
  - label: "Paper"
    href: "https://arxiv.org/abs/0000.00000"
  - label: "Code"
    href: "https://github.com/you/repo"
excerpt: "One or two sentences summarizing the contribution."
bibtex: |
  @inproceedings{you2026,
    title  = {My Paper Title},
    author = {Author, First and Author, Second},
    year   = {2026},
  }
---
```

## 3. Write the body (MDX)

The hero, teaser, link buttons, and BibTeX are rendered automatically from the
front matter. The **body** holds your abstract prose plus figures, tables, and
inline video, using these components. Import only the ones you use, at the top
of the body:

```mdx
import Figure from '../../components/project/Figure.astro';
import ResultsTable from '../../components/project/ResultsTable.astro';
import TeaserVideo from '../../components/project/TeaserVideo.astro';
```

### `Figure` — props `{ src, alt, caption? }`

```mdx
<Figure src="/images/method.png" alt="Method overview" caption="Figure 1. Our pipeline." />
```

### `ResultsTable` — props `{ headers, rows, caption? }`

`headers` is a list of strings/numbers; `rows` is a list of rows (each a list of
cells). The table scrolls horizontally on narrow screens.

```mdx
<ResultsTable
  caption="Table 1. Main results."
  headers={["Method", "Accuracy", "F1"]}
  rows={[
    ["Baseline", 0.81, 0.79],
    ["Ours", 0.95, 0.93],
  ]}
/>
```

### `TeaserVideo` — props `{ src, poster? }`

`src` may be a YouTube URL (`https://www.youtube.com/watch?v=…` or
`https://youtu.be/…`), a Vimeo URL (`https://vimeo.com/123456`), or a direct
mp4 path/URL. YouTube/Vimeo render as a responsive embed; anything else renders
as a `<video controls>` (use `poster` for a still frame).

```mdx
<TeaserVideo src="https://www.youtube.com/watch?v=XXXXXXXXXXX" />
<TeaserVideo src="/files/demo.mp4" poster="/images/demo-poster.png" />
```

`Authors`, `LinkRow`, and `BibTeX` are used by the layout from the front matter;
you normally do not import them by hand.

## 4. Add assets

- Images: put them in `public/images/` and reference them as `/images/<name>`.
- PDFs / videos: put them in `public/files/` and reference them as
  `/files/<name>`.
- External images/videos may be referenced by absolute URL.

## 5. Build a page from a paper — step by step

1. Copy an existing page (e.g. `example-project.mdx`) to
   `src/content/projects/<slug>.mdx`.
2. Fill the front matter: title, authors (+ affiliations, homepage URLs),
   venue, date, `excerpt`, and the `links` row (Paper / Code / arXiv / Project).
3. Add the teaser: a `teaserImage` (drop the file into `public/images/`) or a
   `teaserVideo` URL.
4. Write the abstract as the first prose in the body.
5. Add method/qualitative figures with `<Figure>`.
6. Recreate the paper's key results table(s) with `<ResultsTable>` — read the
   headers and rows straight from the paper.
7. Paste the paper's BibTeX into the `bibtex` field.
8. Verify locally: `npm run build && npm run check` (and `npm test` for the
   smoke suite), then preview with `npm run dev` and open
   `/en/projects/<slug>/`.
9. Delete `example-project.mdx` once you have a real page (or keep it as a
   template).
