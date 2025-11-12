import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { updateMyPassword } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

interface FirstLoginModalProps {
  isOpen: boolean;
  userName: string;
  onSuccess: () => void;
}

export const FirstLoginModal = ({ isOpen, userName, onSuccess }: FirstLoginModalProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validações da senha
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[@$!%*?&#]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;

  const updatePasswordMutation = useMutation({
    mutationFn: updateMyPassword,
    onSuccess: () => {
      toast.success("Senha atualizada!", {
        description: "Sua senha foi alterada com sucesso. Bem-vindo ao Nexxus!",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar senha", {
        description: error?.response?.data?.message || "Não foi possível atualizar sua senha. Tente novamente.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Senha inválida", {
        description: "Verifique se sua senha atende a todos os requisitos.",
      });
      return;
    }

    updatePasswordMutation.mutate({
      newPassword,
      confirmPassword,
    });
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isValid ? "bg-green-100" : "bg-slate-100"}`}>{isValid ? <Icon name="check" size={12} className="text-green-600" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}</div>
      <span className={`text-sm ${isValid ? "text-green-700 font-medium" : "text-slate-600"}`}>{text}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <img src="/src/assets/icons/n-logo.png" alt="Nexxus Logo" className="w-12 h-12" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">Bem-vindo ao Nexxus, {userName}!</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Icon name="info" size={20} className="text-blue-600" />
              Primeiro acesso
            </h3>
            <p className="text-slate-600 leading-relaxed">Para sua segurança, é necessário definir uma nova senha antes de continuar. Uma senha forte protege seus dados e garante a segurança das suas consultas fiscais.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-700 font-semibold">
                Nova Senha *
              </Label>
              <div className="relative">
                <Input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite sua nova senha" className="pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">
                Confirmar Nova Senha *
              </Label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Digite novamente sua senha" className="pr-12" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                  <Icon name={showConfirmPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Requisitos da senha:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ValidationItem isValid={hasMinLength} text="Mínimo de 8 caracteres" />
                <ValidationItem isValid={hasUpperCase} text="Letra maiúscula (A-Z)" />
                <ValidationItem isValid={hasLowerCase} text="Letra minúscula (a-z)" />
                <ValidationItem isValid={hasNumber} text="Número (0-9)" />
                <ValidationItem isValid={hasSpecialChar} text="Caractere especial (@$!%*?&#)" />
                <ValidationItem isValid={passwordsMatch} text="As senhas coincidem" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r rounded-xl from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-semibold"
              disabled={!isPasswordValid || updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Atualizando senha...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon name="check" size={20} />
                  Definir Senha e Continuar
                </span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
