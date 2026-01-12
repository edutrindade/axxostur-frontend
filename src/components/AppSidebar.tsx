import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Icon } from "@/components/ui/icon";

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  key: string;
  submenu?: Array<{
    title: string;
    path: string;
    key: string;
  }>;
}

export const AppSidebar = () => {
  const { logout, role, company } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const superAdminItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <Icon name="dashboard" size={18} />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Empresas",
      icon: <Icon name="building" size={18} />,
      path: "/enterprises",
      key: "enterprises",
    },
    {
      title: "Configurações",
      icon: <Icon name="settings" size={18} />,
      path: "/settings",
      key: "settings",
    },
  ];

  const adminItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <Icon name="dashboard" size={18} />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Cadastros",
      icon: <Icon name="building" size={18} />,
      key: "registrations",
      submenu: [
        { title: "Clientes", path: "/registrations/customers", key: "customers" },
        { title: "Hotéis", path: "/registrations/hotels", key: "hotels" },
        { title: "Ônibus", path: "/registrations/buses", key: "buses" },
        { title: "Usuários", path: "/registrations/users", key: "users" },
      ],
    },
    {
      title: "Pacotes e Viagens",
      icon: <Icon name="map" size={18} />,
      path: "/packages-trips",
      key: "packages-trips",
    },
    {
      title: "PDV",
      icon: <Icon name="dollar" size={18} />,
      path: "/pos",
      key: "pos",
    },
    {
      title: "Financeiro",
      icon: <Icon name="chart" size={18} />,
      path: "/financial",
      key: "financial",
    },
    {
      title: "Configurações",
      icon: <Icon name="settings" size={18} />,
      path: "/settings",
      key: "settings",
    },
  ];

  const attendantItems: MenuItem[] = [
    {
      title: "Clientes",
      icon: <Icon name="users" size={18} />,
      path: "/registrations/customers",
      key: "customers",
    },
    {
      title: "PDV",
      icon: <Icon name="dollar" size={18} />,
      path: "/pos",
      key: "pos",
    },
  ];

  const getMenuItems = () => {
    if (role === "super_admin") return superAdminItems;
    if (role === "admin") return adminItems;
    if (role === "attendant") return attendantItems;
    return [];
  };

  const menuItems = useMemo(() => getMenuItems(), [role]);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-blue-900/20 bg-gradient-to-b from-blue-950 to-blue-900 shadow-xl">
      <SidebarHeader className="border-b border-blue-800/30 bg-gradient-to-r from-blue-950 to-blue-900 px-0 py-0">
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3 flex-1">
            {/* <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 flex-shrink-0">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </div> */}
            <div className="flex flex-col px-3 group-data-[collapsible=offcanvas]:hidden min-w-0">
              <span className="text-sm font-bold text-white truncate">AxxosTur</span>
              <span className="text-xs text-blue-200 font-medium truncate">{company?.fantasyName || "Gestão de Viagens"}</span>
            </div>
          </div>
          <SidebarTrigger className="group-data-[collapsible=offcanvas]:mx-auto p-1.5 rounded-lg hover:bg-blue-800/50 transition-colors duration-200 text-blue-300 hover:text-blue-100 flex-shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-gradient-to-b from-blue-950 to-blue-900 flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4 px-2 group-data-[collapsible=offcanvas]:hidden opacity-70">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const active = item.path ? isActive(item.path) : false;
                const isExpanded = expandedMenu === item.key;
                const hasSubmenu = item.submenu && item.submenu.length > 0;

                return (
                  <div key={item.key}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`cursor-pointer text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 group flex items-center gap-3 ${
                          active || (hasSubmenu && isExpanded) ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                        }`}
                        onClick={() => {
                          if (hasSubmenu) {
                            setExpandedMenu(isExpanded ? null : item.key);
                          } else {
                            navigate(item.path!);
                          }
                        }}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 transition-all duration-200">
                          <span className={active || (hasSubmenu && isExpanded) ? "text-white" : "text-blue-300 group-hover:text-white"}>{item.icon}</span>
                        </div>
                        <span className="font-medium group-data-[collapsible=offcanvas]:hidden text-sm flex-1 text-left">{item.title}</span>
                        {hasSubmenu && <Icon name={isExpanded ? "chevronDown" : "chevronRight"} size={16} className="group-data-[collapsible=offcanvas]:hidden" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {hasSubmenu && isExpanded && item.submenu && (
                      <div className="ml-2 mt-1 space-y-1 border-l border-blue-700/50 pl-2">
                        {item.submenu.map((subitem) => {
                          const subActive = isActive(subitem.path);
                          return (
                            <SidebarMenuItem key={subitem.key}>
                              <SidebarMenuButton
                                tooltip={subitem.title}
                                className={`cursor-pointer text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 group flex items-center gap-3 ${subActive ? "bg-blue-500 text-white shadow-md" : "text-blue-100 hover:bg-blue-800/40 hover:text-white"}`}
                                onClick={() => navigate(subitem.path)}
                              >
                                <div className="flex items-center justify-center w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-400" />
                                <span className="font-medium group-data-[collapsible=offcanvas]:hidden text-sm">{subitem.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-800/30 bg-gradient-to-r from-blue-950 to-blue-900/80 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout()} tooltip="Sair" className="cursor-pointer text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 text-red-300 hover:bg-red-900/40 hover:text-red-200 hover:shadow-sm group flex items-center gap-3">
              <Icon name="logout" size={18} className="text-red-300 group-hover:text-red-200 flex-shrink-0" />
              <span className="group-data-[collapsible=offcanvas]:hidden">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
