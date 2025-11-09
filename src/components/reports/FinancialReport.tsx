import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { FinancialDialog } from "./FinancialDialog";

interface FinancialReportProps {
	financialData: { month: string; revenue: number; expenses: number }[];
	onExport: (type: "pdf" | "excel", reportSection: string) => void;
}

export const FinancialReport = ({
	financialData,
	onExport,
}: FinancialReportProps) => {
	const financialTransactions = [
		{
			id: 1,
			date: "2024-01-15",
			description: "Venda de serviços - Empresa ABC",
			category: "Serviços",
			type: "receita" as const,
			amount: 45000,
			status: "confirmado" as const,
		},
		{
			id: 2,
			date: "2024-01-20",
			description: "Pagamento de fornecedores",
			category: "Operacional",
			type: "despesa" as const,
			amount: 32000,
			status: "confirmado" as const,
		},
		{
			id: 3,
			date: "2024-02-10",
			description: "Venda de produtos - Cliente XYZ",
			category: "Produtos",
			type: "receita" as const,
			amount: 52000,
			status: "confirmado" as const,
		},
		{
			id: 4,
			date: "2024-02-15",
			description: "Aluguel do escritório",
			category: "Infraestrutura",
			type: "despesa" as const,
			amount: 35000,
			status: "confirmado" as const,
		},
		{
			id: 5,
			date: "2024-03-05",
			description: "Consultoria especializada",
			category: "Serviços",
			type: "receita" as const,
			amount: 48000,
			status: "pendente" as const,
		},
		{
			id: 6,
			date: "2024-03-12",
			description: "Marketing digital",
			category: "Marketing",
			type: "despesa" as const,
			amount: 33000,
			status: "confirmado" as const,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon name="dollar" size={20} />
					Relatórios Financeiros
				</CardTitle>
				<CardDescription>
					Comparativo de receitas e despesas por período
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={financialData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip
									formatter={(value: number) => [
										`R$ ${value.toLocaleString()}`,
										"",
									]}
								/>
								<Bar
									dataKey="revenue"
									fill="oklch(0.6 0.118 184.704)"
									name="Receitas"
								/>
								<Bar
									dataKey="expenses"
									fill="oklch(0.65 0.15 35)"
									name="Despesas"
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
							<div className="text-2xl font-bold text-green-600">
								R$ 328.000
							</div>
							<div className="text-sm text-green-700">Total de Receitas</div>
						</div>
						<div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
							<div className="text-2xl font-bold text-red-600">R$ 215.000</div>
							<div className="text-sm text-red-700">Total de Despesas</div>
						</div>
						<div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
							<div className="text-2xl font-bold text-blue-600">R$ 113.000</div>
							<div className="text-sm text-blue-700">Lucro Líquido</div>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<FinancialDialog
							financialTransactions={financialTransactions}
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
							onClick={() => onExport("pdf", "financeiro")}
						>
							<Icon name="download" size={16} className="mr-2" />
							PDF
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onExport("excel", "financeiro")}
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
