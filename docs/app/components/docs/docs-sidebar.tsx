import { Link, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { docPath, docs } from "~/content/nav";

export function DocsSidebar() {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    // Below md the sidebar renders inside a Sheet, opened from the header.
    <Sidebar className="top-14 h-[calc(100svh-3.5rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Docs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docs.map((d) => (
                <SidebarMenuItem key={d.slug}>
                  <SidebarMenuButton
                    isActive={pathname.replace(/\/$/, "") === docPath(d.slug)}
                    className="h-auto flex-col items-start gap-0"
                    render={<Link to={docPath(d.slug)} onClick={() => setOpenMobile(false)} />}
                  >
                    <span>{d.title}</span>
                    <span className="text-muted-foreground">{d.subtitle}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
