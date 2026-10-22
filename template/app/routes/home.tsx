import { Welcome } from "../welcome/welcome";
import { site } from "../lib/site";

export default function Home() {
  return (
    <>
      <title>{site.name}</title>
      <meta name="description" content={site.description} />
      <meta property="og:title" content={site.name} />
      <meta property="og:description" content={site.description} />
      <Welcome />
    </>
  );
}
