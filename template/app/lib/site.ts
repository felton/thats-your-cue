// Facts about the site, read by root.tsx, routes, react-router.config.ts and
// vite.config.ts. No functions: logic belongs in the file that uses a value.
export const site = {
  name: "That's your cue",
  description: "Places, everyone.",
  // Full public address, including any subpath: "https://example.com" or
  // "https://you.github.io/repo". Leave it empty until the site has one: it then
  // serves from "/" and leaves out the tags that need an absolute address.
  url: "",
  // Social card image in public/, ideally 1200x630. Used once url is set.
  image: "",
};
