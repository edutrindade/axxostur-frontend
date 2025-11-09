import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";

interface AppHeaderProps {
  title?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionClick?: () => void;
}

export const AppHeader = ({ title, showActionButton = false, actionButtonText, onActionClick }: AppHeaderProps) => {
  const { user, isSuperAdmin } = useAuth();

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

  return (
    <header className="relative z-0 w-full flex h-20 shrink-0 items-center gap-4 border-b border-slate-200/50 bg-white/95 backdrop-blur-sm px-6 shadow-sm">
      <SidebarTrigger className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-600 hover:text-slate-800 border border-slate-200/50 hover:border-slate-300/60 shadow-sm hover:shadow-md flex items-center justify-center min-w-[44px] min-h-[44px]" />
      <Separator orientation="vertical" className="h-8 bg-slate-200" />

      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 ring-2 ring-slate-200 ring-offset-2">
          <AvatarImage src={""} alt={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()} />
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">
            {(user?.firstName ?? user?.email ?? "").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
            {title || `Olá, ${[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || ""}!`}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {title ? "Painel de Controle" : "Bem-vindo ao sistema"}
          </p>
        </div>
      </div>

      {showActionButton && (
        <div className="ml-auto flex items-center gap-3">
          <Button
            size="default"
            onClick={onActionClick || handleDefaultAction}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-6 py-2.5 rounded-xl font-medium"
          >
            <Icon name="plus" size={18} className="mr-2" />
            {actionButtonText || getDefaultActionText()}
          </Button>
        </div>
      )}
    </header>
  );
};
