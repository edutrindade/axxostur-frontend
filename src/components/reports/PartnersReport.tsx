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
import { PartnersDialog } from "./PartnersDialog";
import { generatePartnersReportPDF } from "@/services/reports/partnersReportPDF";
import { toast } from "sonner";

interface Partner {
	id: number;
	name: string;
	city: string;
	state: string;
	status: string;
	joinDate: string;
	totalSales: string;
}

interface PartnersReportProps {
	partnersData: { city: string; count: number }[];
	detailedPartnersData: Partner[];
	onExport: (type: "pdf" | "excel", reportSection: string) => void;
	startDate?: Date;
	endDate?: Date;
}

export const PartnersReport = ({
	partnersData,
	detailedPartnersData,
	onExport,
	startDate = new Date(new Date().setDate(new Date().getDate() - 30)),
	endDate = new Date(),
}: PartnersReportProps) => {
	const handlePDFExport = () => {
		try {
			const fileName = generatePartnersReportPDF({
				partnersData,
				detailedPartnersData,
				startDate,
				endDate,
			});
			toast.success(`Relatório PDF gerado com sucesso: ${fileName}`);
		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
			toast.error("Erro ao gerar relatório PDF");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon name="users" size={20} />
					Relatórios de Parceiros
				</CardTitle>
				<CardDescription>
					Quantitativo de parceiros por cidade/estado
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="md:h-[500px] h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={partnersData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="city" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="count" fill="oklch(0.6 0.118 184.704)" />
							</BarChart>
						</ResponsiveContainer>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-3 bg-muted/50 rounded-lg">
							<div className="text-lg font-semibold text-green-600">
								{
									detailedPartnersData.filter((p) => p.status === "Ativo")
										.length
								}
							</div>
							<div className="text-sm text-muted-foreground">Ativos</div>
						</div>
						<div className="text-center p-3 bg-muted/50 rounded-lg">
							<div className="text-lg font-semibold text-orange-600">
								{
									detailedPartnersData.filter((p) => p.status === "Inativo")
										.length
								}
							</div>
							<div className="text-sm text-muted-foreground">Inativos</div>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<PartnersDialog
							detailedPartnersData={detailedPartnersData}
							triggerButton={
								<Button variant="outline" size="sm">
									<Icon name="eye" size={16} className="mr-2" />
									Visualizar
								</Button>
							}
						/>
						<Button variant="outline" size="sm" onClick={handlePDFExport}>
							<Icon name="download" size={16} className="mr-2" />
							PDF
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onExport("excel", "parceiros")}
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
