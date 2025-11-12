import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { confirmRecoveryCode, resetPassword } from "@/services/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [step, setStep] = useState<"code" | "password">("code");
  const [isLoading, setIsLoading] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[@$!%*?&#]/.test(newPassword);
  const passwordsMatch = newPassword === confirmNewPassword && confirmNewPassword.length > 0;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    if (step === "code" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate, step]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast.error("Código inválido", {
        description: "Por favor, digite o código completo de 6 dígitos.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await confirmRecoveryCode({ email, code: fullCode });
      toast.success("Código validado!", {
        description: "Agora você pode redefinir sua senha.",
      });
      setStep("password");
    } catch (error: any) {
      toast.error("Código inválido", {
        description: error?.response?.data?.message || "O código digitado está incorreto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Senha inválida", {
        description: "Verifique se sua senha atende a todos os requisitos.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({ email, newPassword });
      toast.success("Senha redefinida com sucesso!", {
        description: "Você já pode fazer login com sua nova senha.",
      });
      navigate("/login");
    } catch (error: any) {
      toast.error("Erro ao redefinir senha", {
        description: error?.response?.data?.message || "Não foi possível redefinir sua senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isValid ? "bg-green-100" : "bg-slate-100"}`}>{isValid ? <Icon name="check" size={12} className="text-green-600" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}</div>
      <span className={`text-sm ${isValid ? "text-green-700 font-medium" : "text-slate-600"}`}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        style={{
          background: `
						linear-gradient(135deg, 
							rgb(15, 23, 42) 0%, 
							rgb(30, 58, 95) 35%, 
							rgb(51, 65, 85) 100%
						)
					`,
        }}
      />

      <div className="absolute inset-0 opacity-50 animate-pulse-subtle">
        <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="white" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-center space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Icon name={step === "code" ? "shield" : "lock"} size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                {step === "code" ? "Verificação de" : "Nova"}
                <span className="block gradient-text">{step === "code" ? "Código" : "Senha"}</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">{step === "code" ? "Digite o código de 6 dígitos que enviamos para seu e-mail para continuar." : "Crie uma senha forte para proteger sua conta."}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-8">
              {step === "code" ? (
                <>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                      <Icon name="mail" size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-300">Código enviado para {email}</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                      <Icon name="clock" size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-300">Código válido por 15 minutos</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                      <Icon name="shield" size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-300">Senha forte e segura</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                      <Icon name="check" size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-300">Validação em tempo real</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-lg animate-slide-in-right">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
              {step === "code" ? (
                <>
                  <div className="text-center space-y-6 mb-8 animate-scale-in">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover-lift interactive-element">
                      <Icon name="shield" size={24} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-slate-800">Digite o código</h2>
                      <p className="text-slate-600">Insira o código de 6 dígitos que enviamos para seu e-mail</p>
                    </div>
                  </div>

                  <form onSubmit={handleCodeSubmit} className="space-y-6">
                    <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                      <label className="text-sm font-medium text-slate-700 text-center block">Código de verificação</label>
                      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-bold bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 focus-ring"
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 interactive-element"
                        disabled={isLoading || code.some((d) => !d)}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verificando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <span>Verificar código</span>
                            <Icon name="arrowRight" size={16} />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-slate-600">Não recebeu o código?</p>
                    <Link to="/forgot-password" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                      <Icon name="arrowLeft" size={16} className="mr-1" />
                      Enviar novamente
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-6 mb-8 animate-scale-in">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover-lift interactive-element">
                      <Icon name="lock" size={24} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-slate-800">Nova senha</h2>
                      <p className="text-slate-600">Crie uma senha forte para sua conta</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                      <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                        Nova Senha *
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Digite sua nova senha"
                          className="h-12 pr-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 focus-ring"
                          required
                          disabled={isLoading}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                          <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                      <label htmlFor="confirmNewPassword" className="text-sm font-medium text-slate-700">
                        Confirmar Nova Senha *
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Digite novamente sua senha"
                          className="h-12 pr-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 focus-ring"
                          required
                          disabled={isLoading}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                          <Icon name={showConfirmPassword ? "eyeOff" : "eye"} size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 space-y-3 animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
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

                    <div className="animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 interactive-element"
                        disabled={!isPasswordValid || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Redefinindo...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Icon name="check" size={20} />
                            <span>Redefinir senha</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
