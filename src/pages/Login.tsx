import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const success = await login(email, password);

			if (success) {
				toast.success("Login realizado com sucesso.", {
					description: "Seja bem-vindo!",
				});
			} else {
				toast.error("Erro ao fazer login", {
					description: "Verifique suas credenciais e tente novamente.",
				});
			}
		} catch (error) {
			console.error("Erro no login:", error);
			toast.error("Erro ao fazer login", {
				description: "Ocorreu um erro inesperado. Tente novamente.",
			});
		} finally {
			setIsLoading(false);
		}
	};

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
					`
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
					<div className="max-w-md text-center space-y-8 animate-fade-in">
						<div className="space-y-6">
							<div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
								<Icon name="shield" size={32} className="text-white" />
							</div>
							<h1 className="text-4xl font-bold text-white leading-tight">
								Consultas Tributárias
								<span className="block gradient-text">Inteligentes</span>
							</h1>
							<p className="text-xl text-slate-300 leading-relaxed">
								Plataforma para automação e análise de dados tributários, com integrações seguras em tempo real.
							</p>
						</div>
						
						<div className="grid grid-cols-2 gap-6 pt-8">
							<div className="text-center space-y-3">
								<div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<Icon name="search" size={20} className="text-white" />
								</div>
								<p className="text-sm text-slate-300">Consultas por NCM e código de barras</p>
							</div>
							<div className="text-center space-y-3">
								<div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<Icon name="clock" size={20} className="text-white" />
								</div>
								<p className="text-sm text-slate-300">Histórico completo de consultas</p>
							</div>
							<div className="text-center space-y-3">
								<div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<Icon name="chart" size={20} className="text-white" />
								</div>
								<p className="text-sm text-slate-300">Relatórios e análises tributárias</p>
							</div>
							<div className="text-center space-y-3">
								<div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<Icon name="users" size={20} className="text-white" />
								</div>
								<p className="text-sm text-slate-300">Gestão de equipe e acessos</p>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
					<div className="w-full max-w-md animate-slide-in-right">
						<div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in">
							<div className="text-center space-y-6 mb-8 animate-scale-in">
								<div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover-lift interactive-element">
									<Icon name="shield" size={24} className="text-white" />
								</div>
								<div className="space-y-2">
									<h2 className="text-3xl font-bold text-slate-800">Bem-vindo ao Nexxus</h2>
									<p className="text-slate-600">Entre na sua conta para continuar</p>
								</div>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
										<label htmlFor="email" className="text-sm font-medium text-slate-700">
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
											<Icon 
												name="mail" 
												size={18} 
												className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" 
											/>
										</div>
									</div>

									<div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
										<label htmlFor="password" className="text-sm font-medium text-slate-700">
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
											<Icon 
												name="lock" 
												size={18} 
												className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" 
											/>
										</div>
									</div>
								</div>

								<div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
									<Button
										type="submit"
										className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 interactive-element"
										disabled={isLoading}
									>
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
								<Link 
									to="/forgot-password"
									className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
								>
									Esqueceu sua senha?
								</Link>
								
								<div className="pt-4 border-t border-slate-200">
									<p className="text-xs text-slate-500">
										©2025 Nexxus. Todos os direitos reservados.
									</p>
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
