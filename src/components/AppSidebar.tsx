import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  ClipboardList,
  CalendarClock,
  BookOpenCheck,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Writer", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/meetings", icon: ClipboardList },
  { title: "Task Planner", url: "/planner", icon: CalendarClock },
  { title: "Research", url: "/research", icon: BookOpenCheck },
  { title: "Assistant Chat", url: "/assistant", icon: MessagesSquare },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 px-3 py-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-accent-gradient flex size-9 shrink-0 items-center justify-center rounded-xl text-base font-bold text-accent-foreground">
            N
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">Northwind Assist</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              Workplace AI suite
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <div className="flex items-start gap-2 rounded-lg bg-sidebar-accent p-2.5 text-xs text-sidebar-foreground/75 group-data-[collapsible=icon]:hidden">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
          <span>AI output is a draft. Review before sending or sharing.</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
