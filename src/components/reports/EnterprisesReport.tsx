import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { BrazilMap } from "./BrazilMap";
import { EnterprisesDialog } from "./EnterprisesDialog";
import { generateEnterprisesReportPDF } from "@/services/reports";

interface EnterprisesReportProps {
	brazilStatesData: Record<string, { companies: number; revenue: number; color: string }>;
	onExport: (type: "pdf" | "excel", reportSection: string) => void;
}

export const EnterprisesReport = ({ brazilStatesData, onExport }: EnterprisesReportProps) => {
	const enterprises = [
		{
			id: 1,
			name: "TechCorp Ltda",
			state: "SP",
			city: "São Paulo",
			status: "ativa" as const,
			registrationDate: "2023-01-15",
			revenue: 850000,
			employees: 45,
		},
		{
			id: 2,
			name: "Inovação Digital S.A.",
			state: "RJ",
			city: "Rio de Janeiro",
			status: "ativa" as const,
			registrationDate: "2023-03-22",
			revenue: 720000,
			employees: 38,
		},
		{
			id: 3,
			name: "StartupBH",
			state: "MG",
			city: "Belo Horizonte",
			status: "pendente" as const,
			registrationDate: "2024-01-10",
			revenue: 320000,
			employees: 15,
		},
		{
			id: 4,
			name: "Soluções Brasília",
			state: "DF",
			city: "Brasília",
			status: "ativa" as const,
			registrationDate: "2023-08-05",
			revenue: 480000,
			employees: 28,
		},
		{
			id: 5,
			name: "Nordeste Tech",
			state: "BA",
			city: "Salvador",
			status: "inativa" as const,
			registrationDate: "2022-11-18",
			revenue: 180000,
			employees: 8,
		},
		{
			id: 6,
			name: "Sul Inovação",
			state: "RS",
			city: "Porto Alegre",
			status: "ativa" as const,
			registrationDate: "2023-06-12",
			revenue: 650000,
			employees: 42,
		},
	];

	// Função para gerar PDF de empresas
	const handleGenerateEnterprisePDF = () => {
		// Criar dados agregados por estado
		const stateData = enterprises.reduce((acc, enterprise) => {
			const state = enterprise.state;
			if (!acc[state]) {
				acc[state] = 0;
			}
			acc[state]++;
			return acc;
		}, {} as Record<string, number>);

		const enterprisesData = Object.entries(stateData).map(([state, count]) => ({
			state,
			count,
		}));

		const reportData = {
			enterprisesData,
			detailedEnterprisesData: enterprises,
			startDate: new Date(2023, 0, 1), // 1º de janeiro de 2023
			endDate: new Date(), // Data atual
		};

		generateEnterprisesReportPDF(reportData);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon name="building" size={20} />
					Relatórios de Empresas
				</CardTitle>
				<CardDescription>
					Distribuição geográfica por estado
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<BrazilMap brazilStatesData={brazilStatesData} />

					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-3 bg-muted/50 rounded-lg">
							<div className="text-lg font-semibold">380</div>
							<div className="text-sm text-muted-foreground">
								Total de Empresas
							</div>
						</div>
						<div className="text-center p-3 bg-muted/50 rounded-lg">
							<div className="text-lg font-semibold">R$ 2.4M</div>
							<div className="text-sm text-muted-foreground">
								Faturamento Total
							</div>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<EnterprisesDialog
							enterprises={enterprises}
							triggerButton={
								<Button variant="outline" size="sm">
									<Icon name="eye" size={16} className="mr-2" />
									Visualizar
								</Button>
							}
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={handleGenerateEnterprisePDF}
						>
							<Icon name="download" size={16} className="mr-2" />
							PDF
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onExport("excel", "empresas")}
						>
							<Icon name="download" size={16} className="mr-2" />
							Excel
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};