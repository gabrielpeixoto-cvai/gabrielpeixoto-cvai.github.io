// Single-language site: content is English, and translation to other languages
// is handled on-demand by the browser's on-device Translator API (see
// TranslateMenu). The `ui` tables below keep ja/pt-br strings as a harmless
// fallback resource but no ja/pt-br routes are generated.
export const LOCALES = ['en'];
export const DEFAULT_LOCALE = 'en';

/**
 * @typedef {'en' | 'ja' | 'pt-br'} Locale
 * Editors/`astro check` infer types from these plain objects; no separate .d.ts is needed.
 */

export const ui = {
  en: {
    'nav.publications': 'Publications',
    'nav.talks': 'Talks',
    'nav.teaching': 'Teaching',
    'nav.portfolio': 'Portfolio',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.notes': 'Notes',
    'nav.cv': 'CV',
    'heading.publications': 'Publications',
    'heading.talks': 'Talks',
    'heading.teaching': 'Teaching',
    'heading.portfolio': 'Portfolio',
    'heading.blog': 'Blog',
    'heading.notes': 'Notes',
    'heading.about': 'About',
    'heading.projects': 'Projects',
    'heading.cv': 'Curriculum Vitae',
    'cv.intro': 'Placeholder content — replace each section with your real details.',
    'cv.education': 'Education',
    'cv.experience': 'Experience',
    'cv.skills': 'Skills',
    'cv.courses': 'Courses & Certifications',
    'cv.languages': 'Languages',
    'cv.publications': 'Publications',
    'cv.service': 'Service',
    'label.paperPdf': 'Paper (PDF)',
    'label.citation': 'Citation',
    'label.projectLink': 'Project link',
    'label.language': 'Language',
    'empty.publications': 'No publications yet.',
    'empty.blog': 'No posts yet.',
    'empty.notes': 'No notes yet.',
    'empty.talks': 'No talks yet.',
    'empty.teaching': 'No teaching entries yet.',
    'empty.portfolio': 'No portfolio items yet.',
    'empty.projects': 'No projects yet.',
  },
  ja: {
    'nav.publications': '論文',
    'nav.talks': '講演',
    'nav.teaching': '教育',
    'nav.portfolio': 'ポートフォリオ',
    'nav.projects': 'プロジェクト',
    'nav.blog': 'ブログ',
    'nav.notes': 'ノート',
    'nav.cv': '履歴書',
    'heading.publications': '論文',
    'heading.talks': '講演',
    'heading.teaching': '教育',
    'heading.portfolio': 'ポートフォリオ',
    'heading.blog': 'ブログ',
    'heading.notes': 'ノート',
    'heading.about': '自己紹介',
    'heading.projects': 'プロジェクト',
    'heading.cv': '履歴書',
    'cv.intro': 'これはプレースホルダーです。各セクションを実際の内容に置き換えてください。',
    'cv.education': '学歴',
    'cv.experience': '職歴',
    'cv.skills': 'スキル',
    'cv.courses': 'コース・資格',
    'cv.languages': '言語',
    'cv.publications': '論文',
    'cv.service': '学術貢献',
    'label.paperPdf': '論文（PDF）',
    'label.citation': '引用',
    'label.projectLink': 'プロジェクトリンク',
    'label.language': '言語',
    'empty.publications': 'まだ論文はありません。',
    'empty.blog': 'まだ投稿はありません。',
    'empty.notes': 'まだノートはありません。',
    'empty.talks': 'まだ講演はありません。',
    'empty.teaching': 'まだ教育実績はありません。',
    'empty.portfolio': 'まだ作品はありません。',
    'empty.projects': 'まだプロジェクトはありません。',
  },
  'pt-br': {
    'nav.publications': 'Publicações',
    'nav.talks': 'Palestras',
    'nav.teaching': 'Ensino',
    'nav.portfolio': 'Portfólio',
    'nav.projects': 'Projetos',
    'nav.blog': 'Blog',
    'nav.notes': 'Notas',
    'nav.cv': 'Currículo',
    'heading.publications': 'Publicações',
    'heading.talks': 'Palestras',
    'heading.teaching': 'Ensino',
    'heading.portfolio': 'Portfólio',
    'heading.blog': 'Blog',
    'heading.notes': 'Notas',
    'heading.about': 'Sobre',
    'heading.projects': 'Projetos',
    'heading.cv': 'Currículo',
    'cv.intro': 'Conteúdo provisório — substitua cada seção pelos seus dados reais.',
    'cv.education': 'Formação',
    'cv.experience': 'Experiência',
    'cv.skills': 'Habilidades',
    'cv.courses': 'Cursos e Certificações',
    'cv.languages': 'Idiomas',
    'cv.publications': 'Publicações',
    'cv.service': 'Serviço',
    'label.paperPdf': 'Artigo (PDF)',
    'label.citation': 'Citação',
    'label.projectLink': 'Link do projeto',
    'label.language': 'Idioma',
    'empty.publications': 'Nenhuma publicação ainda.',
    'empty.blog': 'Nenhuma publicação ainda.',
    'empty.notes': 'Nenhuma nota ainda.',
    'empty.talks': 'Nenhuma palestra ainda.',
    'empty.teaching': 'Nenhum registro de ensino ainda.',
    'empty.portfolio': 'Nenhum item de portfólio ainda.',
    'empty.projects': 'Nenhum projeto ainda.',
  },
};

/**
 * Translate a UI key for a locale, falling back to English.
 * @param {string} locale
 * @param {string} key
 * @returns {string}
 */
export function t(locale, key) {
  const table = ui[locale] ?? ui[DEFAULT_LOCALE];
  return table[key] ?? ui[DEFAULT_LOCALE][key];
}
