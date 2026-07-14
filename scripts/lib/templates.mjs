import { slugify } from './slug.mjs';
import { yamlEscape } from './yaml.mjs';

export const TYPES = {
  post: { collection: 'blog', dated: true },
  note: { collection: 'notes', dated: true },
  talk: { collection: 'talks', dated: true },
  teaching: { collection: 'teaching', dated: true },
  publication: { collection: 'publications', dated: true },
  portfolio: { collection: 'portfolio', dated: false },
};

function isoDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

// Front-matter body per type. Optional URL fields (paperurl, link) are OMITTED
// on purpose: empty strings fail the schema's z.string().url().
function frontMatter(type, title, iso) {
  const t = `title: "${yamlEscape(title)}"`;
  switch (type) {
    case 'post':
    case 'note':
      return `${t}\ndate: ${iso}\ntags: []\nexcerpt: ""`;
    case 'talk':
      return `${t}\ndate: ${iso}\ntype: "Talk"\nvenue: ""\nlocation: ""\nexcerpt: ""`;
    case 'teaching':
      return `${t}\ndate: ${iso}\ntype: "Course"\nvenue: ""\nlocation: ""\nexcerpt: ""`;
    case 'publication':
      return `${t}\ndate: ${iso}\nvenue: ""\ncitation: ""\nexcerpt: ""`;
    case 'portfolio':
      return `${t}\ndate: ${iso}\nexcerpt: ""`;
    default:
      throw new Error(`unknown type: ${type}`);
  }
}

export function scaffold(type, title, date) {
  const spec = TYPES[type];
  if (!spec) throw new Error(`unknown type: ${type}`);
  const iso = isoDate(date);
  const slug = slugify(title) || 'untitled';
  const name = spec.dated ? `${iso}-${slug}.md` : `${slug}.md`;
  const relPath = `src/content/${spec.collection}/${name}`;
  const contents = `---\n${frontMatter(type, title, iso)}\n---\n\nWrite your content here.\n`;
  return { relPath, contents };
}
