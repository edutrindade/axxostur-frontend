import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumb = () => {
    const paths: Record<string, string> = {
      "/": "Dashboard",
      "/registrations/hotels": "Hotéis",
      "/registrations/customers": "Clientes",
      "/registrations/travelers": "Viajantes",
      "/registrations/buses": "Ônibus",
      "/registrations/packages": "Pacotes e Viagens",
      "/financial": "Financeiro",
      "/pos": "PDV",
      "/attendant/customers": "Meus Clientes",
      "/attendant/pos": "PDV",
      "/settings": "Configurações",
      "/enterprises": "Empresas",
      "/profile": "Meu Perfil",
    };

    return paths[location.pathname] || "Página";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Dashboard</span>
        <Icon name="chevronRight" size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-700">{getBreadcrumb()}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-3 cursor-pointer hover:bg-slate-100">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{company?.name}</p>
            </div>
            <div className="flex items-center">
              <Icon name="chevronDown" size={20} className="text-slate-600" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
            <Icon name="users" size={16} className="mr-2" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
            <Icon name="settings" size={16} className="mr-2" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
            <Icon name="logout" size={16} className="mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
