import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionClick?: () => void;
}

export const AppHeader = ({ title, subtitle, showActionButton = false, actionButtonText, onActionClick }: AppHeaderProps) => {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleDefaultAction = () => {
    if (isSuperAdmin) {
      toast.success("Novo Parceiro", {
        description: "Funcionalidade de cadastro de parceiro será implementada.",
      });
    } else {
      toast.success("Nova Empresa", {
        description: "Funcionalidade de cadastro de empresa será implementada.",
      });
    }
  };

  const getDefaultActionText = () => {
    return isSuperAdmin ? "Novo Parceiro" : "Nova Empresa";
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Usuário";
  const initials = user?.firstName ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`.toUpperCase() : (user?.email?.charAt(0) || "U").toUpperCase();

  return (
    <header className="relative z-0 w-full flex h-16 md:h-20 shrink-0 items-center gap-2 md:gap-4 border-b border-slate-200/50 bg-white/95 backdrop-blur-sm px-3 md:px-6 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
          <Icon name="shield" size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Nexxus</span>
        </div>
        <Separator orientation="vertical" className="hidden lg:block h-8 bg-slate-200" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-base md:text-xl font-bold text-slate-800 tracking-tight leading-tight truncate">{title || "Dashboard"}</h1>
        <p className="hidden md:block text-sm text-slate-600 font-medium truncate">{subtitle || "Painel de Controle"}</p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {showActionButton && (
          <Button
            size="default"
            onClick={onActionClick || handleDefaultAction}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-medium text-sm md:text-base"
          >
            <Icon name="plus" size={16} className="md:mr-2" />
            <span className="hidden md:inline">{actionButtonText || getDefaultActionText()}</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-slate-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-md text-slate-700 font-medium">Olá,</span>
                <span className="text-sm font-semibold text-slate-800">{fullName}</span>
              </div>
              <Avatar className="w-10 h-10 ring-2 ring-slate-200">
                <AvatarImage src={""} alt={fullName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900">{fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
              <Icon name="users" size={16} className="mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            {isSuperAdmin && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                <Icon name="settings" size={16} className="mr-2" />
                Configurações
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={logout}>
              <Icon name="logout" size={16} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
