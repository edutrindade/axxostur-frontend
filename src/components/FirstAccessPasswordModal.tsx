import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toast";
import { updateProfile } from "@/services/auth";

interface FirstAccessPasswordModalProps {
  userName: string;
  onSuccess: () => void;
}

interface ValidationState {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const FirstAccessPasswordModal = ({ userName, onSuccess }: FirstAccessPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): ValidationState => {
    return {
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const validation = validatePassword(newPassword);
  const isPasswordValid = validation.minLength && validation.hasLetter && validation.hasNumber && validation.hasSpecial;
  const isPasswordMatching = newPassword === confirmPassword && newPassword.length > 0;
  const isFormValid = isPasswordValid && isPasswordMatching;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await updateProfile({ password: newPassword });
      toast.success("Senha atualizada com sucesso", {
        description: "Sua primeira autenticação foi concluída.",
      });
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao atualizar a senha.";
      toast.error("Erro ao atualizar senha", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Icon name="lock" size={32} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo, {userName}!</h2>
          <p className="text-slate-600">Defina uma nova senha para começar a usar a plataforma</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
              Nova Senha
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                disabled={isLoading}
                className="h-11 pl-12 pr-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
              />
              <Icon name="lock" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
              Confirmar Senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                disabled={isLoading}
                className="h-11 pl-12 pr-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
              />
              <Icon name="lock" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <Icon name={showConfirmPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Requisitos da senha:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all ${validation.minLength ? "bg-green-500" : "bg-slate-300"}`}>{validation.minLength && "✓"}</div>
                <span className={`text-xs ${validation.minLength ? "text-green-700" : "text-slate-600"}`}>Mínimo 8 caracteres</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all ${validation.hasLetter ? "bg-green-500" : "bg-slate-300"}`}>{validation.hasLetter && "✓"}</div>
                <span className={`text-xs ${validation.hasLetter ? "text-green-700" : "text-slate-600"}`}>Contém letra</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all ${validation.hasNumber ? "bg-green-500" : "bg-slate-300"}`}>{validation.hasNumber && "✓"}</div>
                <span className={`text-xs ${validation.hasNumber ? "text-green-700" : "text-slate-600"}`}>Contém número</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all ${validation.hasSpecial ? "bg-green-500" : "bg-slate-300"}`}>{validation.hasSpecial && "✓"}</div>
                <span className={`text-xs ${validation.hasSpecial ? "text-green-700" : "text-slate-600"}`}>Contém caractere especial</span>
              </div>

              {newPassword.length > 0 && !isPasswordMatching && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold bg-red-500">✕</div>
                  <span className="text-xs text-red-700">As senhas não coincidem</span>
                </div>
              )}

              {newPassword.length > 0 && isPasswordMatching && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold bg-green-500">✓</div>
                  <span className="text-xs text-green-700">As senhas coincidem</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Atualizando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Confirmar Nova Senha</span>
                <Icon name="arrowRight" size={16} />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstAccessPasswordModal;
