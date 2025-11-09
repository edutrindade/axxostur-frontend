import { useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import {
	ReportsFilters,
	PartnersReport,
	EnterprisesReport,
	FinancialReport,
} from "@/components/reports";

const Reports = () => {
	const getDefaultDates = () => {
		const today = new Date();
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(today.getDate() - 30);
		return { start: thirtyDaysAgo, end: today };
	};

	const defaultDates = getDefaultDates();
	const [startDate, setStartDate] = useState<Date>(defaultDates.start);
	const [endDate, setEndDate] = useState<Date>(defaultDates.end);
	const [reportType, setReportType] = useState<string>("");
	const [additionalFilters, setAdditionalFilters] = useState<{
		city?: string;
		state?: string;
		status?: string;
	}>({});

	const partnersData = [
		{ city: "São Paulo", count: 45 },
		{ city: "Rio de Janeiro", count: 32 },
		{ city: "Belo Horizonte", count: 28 },
		{ city: "Brasília", count: 22 },
		{ city: "Salvador", count: 18 },
	];

	const detailedPartnersData = [
		{
			id: 1,
			name: "João Silva",
			city: "São Paulo",
			state: "SP",
			status: "Ativo",
			joinDate: "2024-01-15",
			totalSales: "R$ 45.000",
		},
		{
			id: 2,
			name: "Maria Santos",
			city: "São Paulo",
			state: "SP",
			status: "Ativo",
			joinDate: "2024-02-10",
			totalSales: "R$ 38.500",
		},
		{
			id: 3,
			name: "Pedro Costa",
			city: "Rio de Janeiro",
			state: "RJ",
			status: "Ativo",
			joinDate: "2024-01-20",
			totalSales: "R$ 52.000",
		},
		{
			id: 4,
			name: "Ana Oliveira",
			city: "Rio de Janeiro",
			state: "RJ",
			status: "Inativo",
			joinDate: "2023-12-05",
			totalSales: "R$ 28.000",
		},
		{
			id: 5,
			name: "Carlos Ferreira",
			city: "Belo Horizonte",
			state: "MG",
			status: "Ativo",
			joinDate: "2024-03-01",
			totalSales: "R$ 41.200",
		},
		{
			id: 6,
			name: "Lucia Mendes",
			city: "Brasília",
			state: "DF",
			status: "Ativo",
			joinDate: "2024-02-15",
			totalSales: "R$ 35.800",
		},
		{
			id: 7,
			name: "Roberto Lima",
			city: "Salvador",
			state: "BA",
			status: "Ativo",
			joinDate: "2024-01-30",
			totalSales: "R$ 29.600",
		},
		{
			id: 8,
			name: "Fernanda Rocha",
			city: "São Paulo",
			state: "SP",
			status: "Inativo",
			joinDate: "2023-11-20",
			totalSales: "R$ 22.400",
		},
	];

	const financialData = [
		{ month: "Jan", revenue: 45000, expenses: 32000 },
		{ month: "Fev", revenue: 52000, expenses: 35000 },
		{ month: "Mar", revenue: 48000, expenses: 33000 },
		{ month: "Abr", revenue: 61000, expenses: 38000 },
		{ month: "Mai", revenue: 55000, expenses: 36000 },
		{ month: "Jun", revenue: 67000, expenses: 41000 },
	];

	const brazilStatesData = {
		Acre: { companies: 2, revenue: 25000, color: "#eff6ff" },
		Alagoas: { companies: 8, revenue: 95000, color: "#dbeafe" },
		Amapá: { companies: 1, revenue: 12000, color: "#f8fafc" },
		Amazonas: { companies: 5, revenue: 68000, color: "#eff6ff" },
		Bahia: { companies: 45, revenue: 580000, color: "#60a5fa" },
		Ceará: { companies: 32, revenue: 420000, color: "#93c5fd" },
		"Distrito Federal": { companies: 28, revenue: 380000, color: "#93c5fd" },
		"Espírito Santo": { companies: 18, revenue: 240000, color: "#bfdbfe" },
		Goiás: { companies: 35, revenue: 450000, color: "#60a5fa" },
		Maranhão: { companies: 12, revenue: 150000, color: "#dbeafe" },
		"Mato Grosso": { companies: 22, revenue: 290000, color: "#bfdbfe" },
		"Mato Grosso do Sul": { companies: 15, revenue: 195000, color: "#dbeafe" },
		"Minas Gerais": { companies: 68, revenue: 890000, color: "#2563eb" },
		Pará: { companies: 18, revenue: 230000, color: "#bfdbfe" },
		Paraíba: { companies: 10, revenue: 125000, color: "#dbeafe" },
		Paraná: { companies: 52, revenue: 680000, color: "#3b82f6" },
		Pernambuco: { companies: 38, revenue: 495000, color: "#60a5fa" },
		Piauí: { companies: 6, revenue: 78000, color: "#eff6ff" },
		"Rio de Janeiro": { companies: 75, revenue: 980000, color: "#1e40af" },
		"Rio Grande do Norte": { companies: 14, revenue: 180000, color: "#dbeafe" },
		"Rio Grande do Sul": { companies: 58, revenue: 750000, color: "#2563eb" },
		Rondônia: { companies: 4, revenue: 52000, color: "#f8fafc" },
		Roraima: { companies: 1, revenue: 15000, color: "#f8fafc" },
		"Santa Catarina": { companies: 42, revenue: 550000, color: "#3b82f6" },
		"São Paulo": { companies: 125, revenue: 1650000, color: "#1e3a8a" },
		Sergipe: { companies: 7, revenue: 89000, color: "#eff6ff" },
		Tocantins: { companies: 3, revenue: 38000, color: "#f8fafc" },
	};

	const handleExport = (type: "pdf" | "excel", reportSection: string) => {
		console.log(`Exportando ${reportSection} como ${type}`);
	};

	return (
		<>
			<AppHeader showActionButton={false} />

				<div className="flex flex-1 flex-col gap-6 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
							<p className="text-muted-foreground">
								Gere e visualize relatórios detalhados do sistema
							</p>
						</div>
					</div>

					<ReportsFilters
						startDate={startDate}
						endDate={endDate}
						reportType={reportType}
						additionalFilters={additionalFilters}
						onStartDateChange={setStartDate}
						onEndDateChange={setEndDate}
						onReportTypeChange={setReportType}
						onAdditionalFiltersChange={setAdditionalFilters}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<PartnersReport
							partnersData={partnersData}
							detailedPartnersData={detailedPartnersData}
							onExport={handleExport}
							startDate={startDate}
							endDate={endDate}
						/>

						<EnterprisesReport
							brazilStatesData={brazilStatesData}
							onExport={handleExport}
						/>
					</div>

					<FinancialReport
						financialData={financialData}
						onExport={handleExport}
					/>
				</div>
		</>
	);
};

export default Reports;
