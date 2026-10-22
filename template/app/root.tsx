import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { site } from "./lib/site";
import { themeScript } from "./lib/theme";

export const links: Route.LinksFunction = () => [
  // BASE_URL keeps these working when the app is served from a subpath (GitHub Pages).
  // SVG for modern browsers (follows the browser's light/dark setting), .ico as fallback.
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, sizes: "32x32" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Tags that need an absolute address are left out until site.url is set.
  // Error pages (404s included) get no canonical address: they aren't a page to point to.
  const { pathname } = useLocation();
  const error = useRouteError();
  const root = site.url && site.url.replace(/\/?$/, "/");
  const pageUrl = root && !error && new URL(pathname.slice(1), root).href;
  const imageUrl = root && site.image && new URL(site.image, root).href;

  return (
    // suppressHydrationWarning: themeScript adds the `dark` class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Site-wide tags. Page tags (<title>, description) go in each route component. */}
        <meta property="og:site_name" content={site.name} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        {pageUrl && <link rel="canonical" href={pageUrl} />}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
