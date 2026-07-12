export interface SocialLink { label: string; href: string; icon: string; }
export interface NavItem { label: string; href: string; key: string; }

export const siteConfig = {
  title: 'Gabriel Peixoto de Carvalho',
  name: 'Gabriel Peixoto de Carvalho',
  description: 'Personal academic website of Gabriel Peixoto de Carvalho.',
  url: 'https://gabrielpeixoto-cvai.github.io',
  author: {
    name: 'Gabriel Peixoto de Carvalho',
    avatar: '/images/profile.png',
    bio: 'Researcher in computer vision and machine learning.',
    location: 'Koganei, Tokyo, Japan',
  },
  social: [
    { label: 'GitHub', href: 'https://github.com/gabrielpeixoto-cvai', icon: 'github' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=pe7hmi4AAAAJ&hl=en', icon: 'scholar' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0001-8770-573X', icon: 'orcid' },
  ] as SocialLink[],
  nav: [
    { label: 'Publications', href: '/publications/', key: 'nav.publications' },
    { label: 'Talks', href: '/talks/', key: 'nav.talks' },
    { label: 'Teaching', href: '/teaching/', key: 'nav.teaching' },
    { label: 'Portfolio', href: '/portfolio/', key: 'nav.portfolio' },
    { label: 'Blog', href: '/blog/', key: 'nav.blog' },
    { label: 'Notes', href: '/notes/', key: 'nav.notes' },
    { label: 'CV', href: '/cv/', key: 'nav.cv' },
  ] as NavItem[],
};

export type SiteConfig = typeof siteConfig;
