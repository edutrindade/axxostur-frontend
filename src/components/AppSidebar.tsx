import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Icon } from "@/components/ui/icon";

interface AppSidebarProps {
  activeItem?: string;
}

export const AppSidebar = ({ activeItem }: AppSidebarProps) => {
  const { logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: <Icon name="dashboard" size={18} />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Aprovações Pendentes",
      icon: <Icon name="clock" size={18} />,
      path: "/pre-approvals",
      key: "pre-approvals",
      showOnlyForSuperAdmin: true,
    },
    {
      title: "Usuários",
      icon: <Icon name="users" size={18} />,
      path: "/users",
      key: "users",
      showOnlyForSuperAdmin: true,
    },
    {
      title: "Clientes",
      icon: <Icon name="building" size={18} />,
      path: "/clients",
      key: "clients",
      showOnlyForSuperAdmin: true,
    },
    // Cadastros Fiscais - visível para todos os usuários
    {
      title: "Cadastros Fiscais",
      icon: <Icon name="receipt" size={18} />,
      path: "/tax",
      key: "tax",
      showOnlyForSuperAdmin: false,
    },
    // {
    //   title: "Relatórios",
    //   icon: <Icon name="reports" size={18} />,
    //   path: "/reports",
    //   key: "reports",
    //   showOnlyForSuperAdmin: true,
    // },
  ];

  const userMenuItems = [
    {
      title: "Dashboard",
      icon: <Icon name="dashboard" size={18} />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Cadastros Fiscais",
      icon: <Icon name="receipt" size={18} />,
      path: "/tax",
      key: "tax",
    },
  ];

  const menuItems = isSuperAdmin ? adminMenuItems.filter((item) => !item.showOnlyForSuperAdmin || isSuperAdmin) : userMenuItems;

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-300/60 bg-slate-900 shadow-lg">
      <SidebarHeader className="border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-4 px-6 py-6">
          <div className="flex items-center justify-center">
            <Icon name="shield" size={32} className="text-blue-400" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold text-white tracking-tight">Nexxus</span>
            <span className="text-sm text-slate-300 font-medium">Consultas Tributárias</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3 group-data-[collapsible=icon]:hidden">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeItem === item.key}
                    tooltip={item.title}
                    className={`
											cursor-pointer text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 group
											${activeItem === item.key ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg " : "text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-sm"}
										`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center justify-center transition-all duration-200">
                      {React.cloneElement(item.icon, {
                        size: 18,
                        className: activeItem === item.key ? "text-white" : "text-slate-300 group-hover:text-white",
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
            <SidebarMenuButton onClick={logout} tooltip="Sair" className="cursor-pointer text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:shadow-sm group">
              <div className="flex items-center justify-center transition-all duration-200">
                <Icon name="logout" size={18} className="text-red-400 group-hover:text-red-300" />
              </div>
              <span className="ml-3 font-medium group-data-[collapsible=icon]:hidden">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
