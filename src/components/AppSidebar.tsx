
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Users, Settings } from "lucide-react";

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      roles: ['admin', 'student', 'lawyer'],
    },
    {
      title: "Casos",
      icon: FileText,
      path: "/cases",
      roles: ['admin', 'student', 'lawyer'],
    },
    {
      title: "Solicitações",
      icon: Users,
      path: "/requests",
      roles: ['admin', 'student', 'lawyer'],
    },
  ];

  if (!user) return null;

  const filteredItems = navItems.filter(
    (item) => item.roles.includes(user.role)
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center p-4">
          <div className="w-10 h-10 rounded-full bg-npj-blue flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <div className="ml-2">
            <h3 className="font-bold">NPJ Flow</h3>
            <p className="text-xs opacity-70">Gestão Jurídica</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                className={location.pathname === item.path ? "bg-primary/10" : ""}
                onClick={() => navigate(item.path)}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            Logado como <span className="font-medium">{user.role}</span>
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
