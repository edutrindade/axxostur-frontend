import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import axxosTurLogo from "@/assets/img/axxostur-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos", {
        description: "E-mail e senha são obrigatórios.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast.success("Login realizado com sucesso.", {
          description: "Bem-vindo ao AxxosTur!",
        });
        navigate("/");
      } else {
        toast.error("Erro ao fazer login", {
          description: "Verifique suas credenciais e tente novamente.",
        });
      }
    } catch (error) {
      toast.error("Erro ao fazer login", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      {/* Background com cores da logo */}
      <div
        className="absolute inset-0"
        style={{
          background: `
						linear-gradient(135deg, 
							#f5f7fa 0%,
							#e8f0ff 50%,
							#f5f7fa 100%
						)
					`,
        }}
      />

      {/* Padrão de dots mais sutil */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#0052CC" fillOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Elementos decorativos com cores da logo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-subtle" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-50 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-subtle" style={{ animationDelay: "0.5s" }} />

      <div className="relative z-10 min-h-screen flex">
        {/* Lado esquerdo - Informações */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex justify-center mb-2">
                <img src={axxosTurLogo} alt="AxxosTur Logo" className="h-24 w-auto object-contain" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                Gestão de Viagens
                <span className="block text-blue-600">Simplificada</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">Plataforma completa para gerenciar pacotes, vendas e operações de turismo com eficiência.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100 group-hover:border-blue-300 group-hover:bg-blue-100 transition-all duration-300">
                  <Icon name="map" size={22} className="text-blue-600" />
                </div>
                <p className="text-sm text-slate-600">Gestão de pacotes</p>
              </div>
              <div className="text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center border-2 border-orange-100 group-hover:border-orange-300 group-hover:bg-orange-100 transition-all duration-300">
                  <Icon name="calendar" size={22} className="text-orange-600" />
                </div>
                <p className="text-sm text-slate-600">Controle de viagens</p>
              </div>
              <div className="text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-100 group-hover:border-blue-300 group-hover:bg-blue-100 transition-all duration-300">
                  <Icon name="dollar" size={22} className="text-blue-600" />
                </div>
                <p className="text-sm text-slate-600">Controle financeiro</p>
              </div>
              <div className="text-center space-y-3 group">
                <div className="w-14 h-14 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center border-2 border-orange-100 group-hover:border-orange-300 group-hover:bg-orange-100 transition-all duration-300">
                  <Icon name="users" size={22} className="text-orange-600" />
                </div>
                <p className="text-sm text-slate-600">Gestão de equipe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-lg animate-slide-in-right">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 animate-fade-in">
              {/* Logo no topo do formulário (mobile) */}
              <div className="lg:hidden text-center mb-6">
                <img src={axxosTurLogo} alt="AxxosTur Logo" className="h-16 w-auto object-contain mx-auto mb-4" />
              </div>

              <div className="text-center space-y-3 mb-8 animate-scale-in">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Bem-vindo ao AxxosTur</h2>
                <p className="text-slate-600">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      E-mail
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu e-mail"
                        required
                        disabled={isLoading}
                        className="h-12 pl-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 focus-ring"
                      />
                      <Icon name="mail" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                        disabled={isLoading}
                        className="h-12 pl-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 focus-ring"
                        showPasswordToggle={true}
                      />
                      <Icon name="lock" size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
                  <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300  interactive-element" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Entrar</span>
                        <Icon name="arrowRight" size={16} />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center space-y-4">
                <Link to="/forgot-password" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  Esqueceu sua senha?
                </Link>

                {/* <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Ainda não tem uma conta?</p>
                  <Link
                    to="/pre-registration"
                    className="inline-flex items-center justify-center w-full h-12 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="userPlus" size={16} />
                      <span>Cadastre-se agora</span>
                    </div>
                  </Link>
                </div> */}

                <div className="pt-4">
                  <p className="text-xs text-slate-500">©{currentYear} AxxosTur. Todos os direitos reservados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
