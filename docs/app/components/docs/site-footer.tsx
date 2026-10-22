import { REPO_URL } from "~/content/nav";
import { templateVersion } from "~/lib/template-version";

export function SiteFooter() {
  return (
    <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
      Built with{" "}
      <a
        href={`${REPO_URL}/releases/tag/template-v${templateVersion}`}
        className="underline underline-offset-2 hover:text-foreground"
      >
        That's your cue v{templateVersion}
      </a>{" "}
      by{" "}
      <a
        href="https://github.com/felton"
        className="underline underline-offset-2 hover:text-foreground"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/felton.png`}
          alt=""
          width={96}
          height={96}
          className="mr-1 inline-block size-[1.5em] rounded-full align-middle"
        />
        @felton
      </a>
    </footer>
  );
}
