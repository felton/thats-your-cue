import { Link, Outlet, useLocation } from "react-router";

import { DocsSidebar } from "~/components/docs/docs-sidebar";
import { PrevNext } from "~/components/docs/prev-next";
import { SiteFooter } from "~/components/docs/site-footer";
import { SiteHeader } from "~/components/docs/site-header";
import { Toc } from "~/components/docs/toc";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { docPath, docs, findDoc } from "~/content/nav";

export default function DocsLayout() {
  const { pathname } = useLocation();
  const { page, prev, next } = findDoc(pathname);

  return (
    <SidebarProvider className="flex-col">
      <SiteHeader leading={<SidebarTrigger className="md:hidden" />} />
      <div className="flex flex-1">
        <DocsSidebar />
        <SidebarInset className="min-w-0">
          <div className="mx-auto flex w-full max-w-5xl flex-1 gap-10 px-4 py-10 md:px-8">
            <article id="doc-content" data-doc-content className="min-w-0 flex-1">
              {page && (
                <header className="flex flex-col gap-3">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to={docPath(docs[0].slug)} />}>
                          Docs
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{page.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
                  <p className="text-lg text-muted-foreground">{page.subtitle}</p>
                </header>
              )}
              <Outlet />
              {page && <PrevNext page={page} prev={prev} next={next} />}
            </article>
            <aside className="hidden w-48 shrink-0 lg:block">
              <div className="sticky top-24">
                <Toc containerId="doc-content" />
              </div>
            </aside>
          </div>
          <SiteFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
