import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Plan } from "@/types/plan";
import { DEFAULT_PLAN_FEATURES, PLAN_CONFIGS } from "@/types/plan";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils/format";

interface PlanCardProps {
	plan: Plan;
	onEdit?: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit }) => {
	const { isSuperAdmin } = useAuth();
	plan.features = [...DEFAULT_PLAN_FEATURES[plan.type]];
	const config = PLAN_CONFIGS[plan.type];

	return (
		<Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
			<div
				className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
			/>

			<CardHeader className="relative pb-2 pt-2">
				<div className="flex items-start justify-between">
					<div className="flex flex-col items-center w-full">
						<div className="relative mb-2">
							<img src={config.icon} alt={config.name} className="w-32 h-28 " />
						</div>

						<div
							className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.badgeColor} group-hover:scale-105 transition-transform duration-300`}
						>
							{config.name}
						</div>

						<h3 className="text-xl font-bold text-gray-800 text-center group-hover:text-gray-900 transition-colors duration-300">
							{plan.name}
						</h3>
					</div>

					{isSuperAdmin && (
						<Button
							variant="secondary"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onEdit?.(plan);
							}}
							className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
						>
							<Icon name="edit" className="h-4 w-4" />
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent className="relative px-6 pb-8">
				<div className="text-center mb-6">
					<div className="relative">
						<div
							className={`text-4xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
						>
							{formatCurrency(plan.price)}
						</div>
						<div className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
							por mês
						</div>
					</div>
				</div>

				<div className="text-center mb-6">
					<p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
						{plan.description}
					</p>
				</div>

				{plan.features && plan.features.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-semibold text-gray-800 text-center mb-4">
							Vantagens Incluídas
						</h4>
						<div className="space-y-1">
							{plan.features.slice(0, 10).map((feature, index) => (
								<div
									key={index.toString()}
									className="flex items-start gap-2 text-sm"
								>
									<div
										className={`flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center mt-0.5`}
									>
										<Icon name="check" className="w-2.5 h-2.5 text-white" />
									</div>
									<span className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
										{feature}
									</span>
								</div>
							))}
							{plan.features.length > 10 && (
								<div className="text-center pt-2">
									<span
										className={`text-xs font-medium bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}
									>
										+{plan.features.length - 4} vantagens adicionais
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
					<div
						className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.color} transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000`}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
