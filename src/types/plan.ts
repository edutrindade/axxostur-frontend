export type PlanType = "BASIC" | "PREMIUM" | "ENTERPRISE";

export interface Plan {
	id: string;
	name: string;
	description: string;
	price: number;
	type: PlanType;
	active: boolean;
	features: string[]; // Nova propriedade para as vantagens
	createdAt: string;
	updatedAt: string;
}

export interface CreatePlanData {
	name: string;
	description: string;
	price: number;
	type: PlanType;
	features: string[]; // Adicionado aqui também
}

export interface UpdatePlanData {
	name?: string;
	description?: string;
	price?: number;
	type?: PlanType;
	active?: boolean;
	features?: string[]; // E aqui também
}

export interface ListPlansParams {
	search?: string;
}

export interface ListPlansResponse {
	data: Plan[];
}

export const PLAN_CONFIGS = {
	BASIC: {
		name: "Iniciante",
		color: "from-blue-500 to-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		textColor: "text-blue-700",
		badgeColor: "bg-blue-100 text-blue-800",
		icon: "/src/assets/icons/plan-basic.png",
	},
	PREMIUM: {
		name: "Profissional",
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		textColor: "text-purple-700",
		badgeColor: "bg-purple-100 text-purple-800",
		icon: "/src/assets/icons/plan-premium.png",
	},
	ENTERPRISE: {
		name: "Corporativo",
		color: "from-amber-500 to-amber-600",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-200",
		textColor: "text-amber-700",
		badgeColor: "bg-amber-100 text-amber-800",
		icon: "/src/assets/icons/plan-enterprise.png",
	},
} as const;

export const DEFAULT_PLAN_FEATURES = {
	BASIC: [
		"Relatórios automatizados e conformes às exigências legais",
		"Gerenciamento integrado de clientes, equipes, drones e produtos",
		"Registro de produção diária por pilotos",
		"Controle de despesas individuais e por equipe",
		"Folha de Pagamento",
		"Administração completa de ordens de serviço do início ao fim",
		"Painel interativo com gráficos detalhados",
		"Acesso multiplataforma: computador, tablet e smartphone",
		"Armazenamento seguro com backups automáticos na nuvem",
	],
	PREMIUM: [
		"Relatórios automatizados e conformes às exigências legais",
		"Gerenciamento integrado de clientes, equipes, drones e produtos",
		"Registro de produção diária por pilotos",
		"Controle de despesas individuais e por equipe",
		"Folha de Pagamento",
		"Administração completa de ordens de serviço do início ao fim",
		"Painel interativo com gráficos detalhados",
		"Acesso multiplataforma: computador, tablet e smartphone",
		"Armazenamento seguro com backups automáticos na nuvem",
	],
	ENTERPRISE: [
		"Relatórios automatizados e conformes às exigências legais",
		"Gerenciamento integrado de clientes, equipes, drones e produtos",
		"Registro de produção diária por pilotos",
		"Controle de despesas individuais e por equipe",
		"Folha de Pagamento",
		"Administração completa de ordens de serviço do início ao fim",
		"Painel interativo com gráficos detalhados",
		"Acesso multiplataforma: computador, tablet e smartphone",
		"Armazenamento seguro com backups automáticos na nuvem",
	],
} as const;
