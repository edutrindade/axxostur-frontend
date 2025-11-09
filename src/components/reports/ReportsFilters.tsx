import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface ReportsFiltersProps {
	startDate: Date;
	endDate: Date;
	reportType: string;
	additionalFilters: {
		city?: string;
		state?: string;
		status?: string;
	};
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date) => void;
	onReportTypeChange: (type: string) => void;
	onAdditionalFiltersChange: (filters: {
		city?: string;
		state?: string;
		status?: string;
	}) => void;
}

const reportTypes = [
	{ value: "partners", label: "Parceiros" },
	{ value: "enterprises", label: "Empresas" },
	{ value: "financial", label: "Financeiro" },
];

export const ReportsFilters = ({
	startDate,
	endDate,
	reportType,
	additionalFilters,
	onStartDateChange,
	onEndDateChange,
	onReportTypeChange,
	onAdditionalFiltersChange,
}: ReportsFiltersProps) => {
	const renderAdditionalFilters = () => {
		if (!reportType) return null;

		switch (reportType) {
			case "partners":
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="city">Cidade</Label>
							<Input
								id="city"
								placeholder="Filtrar por cidade"
								value={additionalFilters.city || ""}
								onChange={(e) =>
									onAdditionalFiltersChange({
										...additionalFilters,
										city: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="state">Estado</Label>
							<Input
								id="state"
								placeholder="Filtrar por estado"
								value={additionalFilters.state || ""}
								onChange={(e) =>
									onAdditionalFiltersChange({
										...additionalFilters,
										state: e.target.value,
									})
								}
							/>
						</div>
					</div>
				);
			case "enterprises":
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="region">Região</Label>
							<Select
								value={additionalFilters.state || ""}
								onValueChange={(value) =>
									onAdditionalFiltersChange({
										...additionalFilters,
										state: value,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione a região" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="sudeste">Sudeste</SelectItem>
									<SelectItem value="sul">Sul</SelectItem>
									<SelectItem value="nordeste">Nordeste</SelectItem>
									<SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
									<SelectItem value="norte">Norte</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={additionalFilters.status || ""}
								onValueChange={(value) =>
									onAdditionalFiltersChange({
										...additionalFilters,
										status: value,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Ativo</SelectItem>
									<SelectItem value="inactive">Inativo</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon name="filter" size={20} />
					Filtros
				</CardTitle>
				<CardDescription>
					Defina o período e tipo de relatório para visualização
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="start-date">Data Inicial *</Label>
						<DatePicker
							value={startDate}
							onChange={(date) => date && onStartDateChange(date)}
							placeholder="Selecione a data inicial"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="end-date">Data Final *</Label>
						<DatePicker
							value={endDate}
							onChange={(date) => date && onEndDateChange(date)}
							placeholder="Selecione a data final"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="report-type">Tipo de Relatório</Label>
						<Select value={reportType} onValueChange={onReportTypeChange}>
							<SelectTrigger>
								<SelectValue placeholder="Selecione o tipo" />
							</SelectTrigger>
							<SelectContent>
								{reportTypes.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				{renderAdditionalFilters()}
			</CardContent>
		</Card>
	);
};
