import { Link } from "react-router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

import UnsplashPicture from "~/components/image/unsplash-picture";
import { Clapperboard } from "lucide-react";

import { ThemeToggle } from "~/components/theme-toggle";
import { site } from "~/lib/site";

const resources = [
  {
    title: "React Router",
    href: "https://reactrouter.com/docs",
    description: "Routing, data loading and actions.",
  },
  {
    title: "shadcn/ui",
    href: "https://ui.shadcn.com/docs",
    description: "Copy-in components built on Radix.",
  },
  {
    title: "Tailwind CSS",
    href: "https://tailwindcss.com/docs",
    description: "Utility classes and theming.",
  },
];

export function Welcome() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight flex gap-2 items-center">
            <Clapperboard strokeWidth={1.5} /> {site.name}
          </Link>

          <div className="flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link to="/" />}
                    className={navigationMenuTriggerStyle()}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Call Sheet</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-72 gap-1 p-2">
                      {resources.map((r) => (
                        <li key={r.href}>
                          <NavigationMenuLink href={r.href} target="_blank" rel="noreferrer">
                            <div className="text-sm font-medium">{r.title}</div>
                            <p className="text-sm text-muted-foreground">{r.description}</p>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-3xl flex-col items-center gap-8">
          <figure className="w-full">
            <UnsplashPicture
              photoId="photo-1558970439-add78fc68990"
              ixid="NHwxMjA3fDA%3D"
              alt="Describe the image"
              aspect="3:2"
              priority
              // Image never renders wider than max-w-3xl (768px), so don't
              // fetch the 1920px hero sizes from the default table.
              breakpoints={[
                { minWidth: 640, width: 768, aspect: "3:2" },
                { minWidth: 0, width: 640, aspect: "3:2" },
              ]}
              pictureClassName="block overflow-hidden rounded-xl border"
            />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
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

          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Places, everyone.</h1>
            <p className="mt-2 text-muted-foreground">
              Nothing’s been shot yet. Start in
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                app/welcome/welcome.tsx
              </code>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
