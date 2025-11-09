import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Icon } from "@/components/ui/icon";
import type { DashboardOverview } from "@/types/dashboard";

interface TotalStatsCardsProps {
	data: DashboardOverview;
}

const TotalStatsCards = ({ data }: TotalStatsCardsProps) => {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
			<Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20 hover:bg-blue-500/15 hover:shadow-lg transition-all duration-300 cursor-pointer">
				<AspectRatio ratio={3 / 1}>
					<CardHeader className="flex flex-col justify-between h-full p-6">
						<div className="flex items-center justify-between">
							<Icon name="dollar" size={36} className="text-blue-600" />
							<div className="text-2xl ml-4 font-bold text-blue-600">
								{formatCurrency(data.totalNewClients)}
							</div>
						</div>
						<div>
							<CardTitle className="text-base font-semibold text-blue-600 mt-2">
								Receita Total
							</CardTitle>
							<p className="text-sm text-blue-600/70 mt-1">Acumulado geral</p>
						</div>
					</CardHeader>
				</AspectRatio>
			</Card>

			<Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20 hover:bg-purple-500/15 hover:shadow-lg transition-all duration-300 cursor-pointer">
				<AspectRatio ratio={3 / 1}>
					<CardHeader className="flex flex-col justify-between h-full p-6">
						<div className="flex items-center justify-between">
							<Icon name="file" size={36} className="text-purple-600" />
							<div className="text-4xl ml-4 font-bold text-purple-600">
								{data.totalNewClients}
							</div>
						</div>
						<div>
							<CardTitle className="text-base font-semibold text-purple-600 mt-2">
								Total de Contratos
							</CardTitle>
							<p className="text-sm text-purple-600/70 mt-1">
								Fechados no período
							</p>
						</div>
					</CardHeader>
				</AspectRatio>
			</Card>

			<Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/20 hover:bg-red-500/15 hover:shadow-lg transition-all duration-300 cursor-pointer">
				<AspectRatio ratio={3 / 1}>
					<CardHeader className="flex flex-col justify-between h-full p-6">
						<div className="flex items-center justify-between">
							<Icon name="trendingDown" size={36} className="text-red-600" />
							<div className="text-4xl ml-4 font-bold text-red-600">
								{data.cancellationRate}%
							</div>
						</div>
						<div>
							<CardTitle className="text-base font-semibold text-red-600 mt-2">
								Taxa de Cancelamento
							</CardTitle>
							<p className="text-sm text-red-600/70 mt-1">
								Contratos cancelados
							</p>
						</div>
					</CardHeader>
				</AspectRatio>
			</Card>

			<Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20 hover:bg-green-500/15 hover:shadow-lg transition-all duration-300 cursor-pointer">
				<AspectRatio ratio={3 / 1}>
					<CardHeader className="flex flex-col justify-between h-full p-6">
						<div className="flex items-center justify-between">
							<Icon name="trending" size={36} className="text-green-600" />
							<div className="text-4xl ml-4 font-bold text-green-600">
								{data.retentionRate}%
							</div>
						</div>
						<div>
							<CardTitle className="text-base font-semibold text-green-600 mt-2">
								Taxa de Retenção
							</CardTitle>
							<p className="text-sm text-green-600/70 mt-1">
								Clientes mantidos
							</p>
						</div>
					</CardHeader>
				</AspectRatio>
			</Card>
		</div>
	);
};

export default TotalStatsCards;
