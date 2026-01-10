import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Icon } from "@/components/ui/icon";
import nexxusLogo from "@/assets/icons/n-logo.png";

export const AppSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Icon name="dashboard" size={18} />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Empresas",
      icon: <Icon name="building" size={18} />,
      path: "/companies",
      key: "companies",
    },
    {
      title: "Pacotes",
      icon: <Icon name="map" size={18} />,
      path: "/packages",
      key: "packages",
    },
    {
      title: "Viagens",
      icon: <Icon name="calendar" size={18} />,
      path: "/trips",
      key: "trips",
    },
    {
      title: "Vendas",
      icon: <Icon name="dollar" size={18} />,
      path: "/sales",
      key: "sales",
    },
    {
      title: "Configurações",
      icon: <Icon name="settings" size={18} />,
      path: "/settings",
      key: "settings",
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-300/60 bg-slate-900 shadow-lg">
      <SidebarHeader className="border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between gap-4 px-0 py-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-0">
              <img src={nexxusLogo} alt="AxxosTur Logo" className="h-16 w-16 object-contain" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xl font-bold text-white tracking-tight">AxxosTur</span>
              <span className="text-sm text-slate-300 font-medium">Gestão de Viagens</span>
            </div>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto p-2 rounded-lg hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-white" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3 group-data-[collapsible=icon]:hidden">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton tooltip={item.title} className="cursor-pointer text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 group text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-sm" onClick={() => navigate(item.path)}>
                    <div className="flex items-center justify-center transition-all duration-200">
                      {React.cloneElement(item.icon, {
                        size: 18,
                        className: "text-slate-300 group-hover:text-white",
                      })}
                    </div>
                    <span className="ml-3 font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700/50 bg-slate-800/50 px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout()} tooltip="Sair" className="cursor-pointer text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:shadow-sm group">
              Sair
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
