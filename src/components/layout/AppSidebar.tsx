import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Receipt,
  Settings,
  Users,
  BarChart3,
  Shield,
  Zap,
  CreditCard,
  FileText,
  Search,
  Plus
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inbox", url: "/inbox", icon: Inbox, badge: 23 },
  { title: "Sources", url: "/sources", icon: Receipt },
  { title: "Rules", url: "/rules", icon: Zap },
  { title: "Approvals", url: "/approvals", icon: Shield, badge: 5 },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const adminNavItems = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Audit", url: "/audit", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "nav-item-active" 
      : "nav-item-hover text-sidebar-foreground/80";

  return (
    <Sidebar
      className="transition-all duration-300 border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar/50 backdrop-blur-sm">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-sidebar-border/50">
          {isCollapsed ? (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <CreditCard className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <CreditCard className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-sidebar-foreground">ExpenseFlow</span>
                <p className="text-xs text-sidebar-foreground/60">Enterprise</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border/50">
            <Button 
              size="sm" 
              className="w-full enterprise-button bg-primary/90 hover:bg-primary shadow-sm"
              onClick={() => window.location.href = '/add-expense'}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Button>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
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