import { ArrowRight, Blocks, Bot, Moon } from "lucide-react";
import { Link } from "react-router";

import { CopyButton } from "~/components/docs/copy-button";
import { SiteFooter } from "~/components/docs/site-footer";
import { SiteHeader } from "~/components/docs/site-header";
import UnsplashPicture from "~/components/image/unsplash-picture";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { REPO_URL } from "~/content/nav";
import { templateVersion } from "~/lib/template-version";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "that's your cue: a ready-to-shoot Vite starter" },
    {
      name: "description",
      content:
        "React Router, shadcn/ui on Base UI and Tailwind CSS v4, set up and ready to build on.",
    },
  ];
}

const scaffold = "pnpm create thats-your-cue my-app";

const features = [
  {
    icon: Blocks,
    title: "The stack, wired up",
    description:
      "React Router v8 in framework mode, Tailwind CSS v4 and shadcn/ui on Base UI, with typed routes and SSR, SPA or pre-rendered builds.",
  },
  {
    icon: Moon,
    title: "Dark mode, no provider",
    description:
      "A Light / Dark / System menu, a theme script that runs before first paint, and semantic tokens that handle both themes.",
  },
  {
    icon: Bot,
    title: "Ready for agents",
    description:
      "AGENTS.md, the official React Router and shadcn skills, and one pnpm check that formats, lints, typechecks and tests.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 text-center sm:py-16">
          <Badge variant="outline">v{templateVersion}</Badge>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Places, everyone.</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              That's your cue is a ready-to-shoot Vite starter. The setup is done, so you or a
              coding agent can start on the actual site.
            </p>
          </div>

          <div className="flex w-full max-w-xl items-center gap-2 border bg-muted/40 py-1 pr-1 pl-4 text-left">
            <code className="min-w-0 flex-1 truncate text-sm">{scaffold}</code>
            <CopyButton text={() => scaffold} />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button size="lg" render={<Link to="/docs/call-sheet" />}>
              Get started
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<a href={REPO_URL} />}>
              View on GitHub
            </Button>
          </div>

          <figure className="w-full">
            <UnsplashPicture
              photoId="photo-1558970439-add78fc68990"
              ixid="NHwxMjA3fDA%3D"
              alt="An empty theater stage under blue spotlights, a ladder propped against a lit window"
              priority
              // Never wider than max-w-5xl (1024px) less the side padding.
              breakpoints={[
                { minWidth: 1024, width: 992, aspect: "21:9" },
                { minWidth: 640, width: 992, aspect: "16:9" },
                { minWidth: 0, width: 640, aspect: "4:3" },
              ]}
              pictureClassName="block overflow-hidden border"
            />
            <figcaption className="mt-2 text-xs text-muted-foreground">
              Photo by{" "}
              <a
                href="https://unsplash.com/@stak59?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                className="underline underline-offset-2 hover:text-foreground"
              >
                stefano stacchini
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/photos/stage-set-with-chairs-and-tables-jhPSJDhiRyQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Unsplash
              </a>
            </figcaption>
          </figure>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 text-muted-foreground" strokeWidth={1.5} />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
