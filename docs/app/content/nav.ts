// The docs pages, in reading order. The sidebar, previous / next links, page
// titles and "Edit this page" links all come from this list.
export const docs = [
  { slug: "call-sheet", title: "Call Sheet", subtitle: "Getting started" },
  { slug: "blocking", title: "Blocking", subtitle: "Routing and layout" },
  { slug: "props", title: "Props", subtitle: "Components" },
  { slug: "wardrobe", title: "Wardrobe", subtitle: "Theming" },
  { slug: "wrap", title: "Wrap", subtitle: "Build and deploy" },
] as const;

export type DocPage = (typeof docs)[number];
export type DocSlug = DocPage["slug"];

export const REPO_URL = "https://github.com/felton/thats-your-cue";

export function docPath(slug: DocSlug) {
  return `/docs/${slug}`;
}

export function editUrl(slug: DocSlug) {
  return `${REPO_URL}/blob/main/docs/app/content/${slug}.mdx`;
}

export function findDoc(pathname: string) {
  const index = docs.findIndex((d) => pathname.replace(/\/$/, "").endsWith(docPath(d.slug)));
  return {
    page: docs[index] as DocPage | undefined,
    prev: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

export function docMeta(slug: DocSlug) {
  const page = docs.find((d) => d.slug === slug)!;
  return [
    { title: `${page.title}: ${page.subtitle} · that's your cue` },
    { name: "description", content: `That's your cue docs: ${page.subtitle.toLowerCase()}.` },
  ];
}
