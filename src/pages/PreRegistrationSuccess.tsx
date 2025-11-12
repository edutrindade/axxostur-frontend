import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const PreRegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get("dev") === "true";

    if (!location.state?.fromPreRegistration && !devMode) {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl animate-slide-in-up">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-scale-in">
                  <Icon name="check" size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Pré-Cadastro Realizado com Sucesso!</h1>
              <p className="text-green-100 text-lg">Estamos muito felizes em ter você conosco</p>
            </div>

            <div className="px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                      <Icon name="clock" size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Aguarde a Aprovação</h2>
                    <p className="text-slate-600 leading-relaxed">Seu pré-cadastro foi efetivado com sucesso! Agora, um de nossos analistas irá revisar as informações fornecidas e aprovar o cadastro da sua empresa.</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Icon name="mail" size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-800 mb-2">Fique atento ao seu e-mail!</p>
                        <p className="text-slate-600 text-sm">Assim que a aprovação for concluída, você receberá suas credenciais de acesso por e-mail e poderá começar a utilizar a plataforma.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl md:mt-4 font-bold text-slate-800">Conheça mais sobre o Nexxus</h3>
                  <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto">
                        <Icon name="play" size={32} className="text-slate-600 ml-1" />
                      </div>
                      <p className="text-slate-600 font-medium">Vídeo em breve</p>
                      <p className="text-sm text-slate-500">Aqui você poderá assistir um vídeo sobre a plataforma</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 pt-8 mt-8 border-t border-slate-200">
                <Link to="/login" className="w-full max-w-md">
                  <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Icon name="arrowLeft" size={18} />
                      <span>Voltar para o Login</span>
                    </div>
                  </Button>
                </Link>
                <p className="text-sm text-slate-500 text-center">
                  Tem alguma dúvida? Entre em contato conosco pelo e-mail{" "}
                  <a href="mailto:contato@nexxus.com.br" className="text-blue-600 hover:text-blue-700 font-medium">
                    contato@nexxus.com.br
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistrationSuccess;
