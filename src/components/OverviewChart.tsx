import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { DashboardOverview } from "@/types/dashboard";

interface OverviewChartProps {
	data: DashboardOverview;
}

const OverviewChart = ({ data }: OverviewChartProps) => {
	const getCSSVariable = (variable: string) => {
		return getComputedStyle(document.documentElement)
			.getPropertyValue(variable)
			.trim();
	};

	const colors = {
		primary: getCSSVariable("--primary"),
		mutedForeground: getCSSVariable("--muted-foreground"),
		background: getCSSVariable("--background"),
	};

	const formatMonth = (month: string) => {
		const [year, monthNum] = month.split("-");
		const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
		return date.toLocaleDateString("pt-BR", {
			month: "short",
			year: "2-digit",
		});
	};

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: Array<{
			value: number;
		}>;
		label?: string;
	}) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
					<p className="text-sm font-medium text-foreground mb-1">
						{label ? formatMonth(label) : ""}
					</p>
					<p className="text-sm text-muted-foreground">
						<span
							className="inline-block w-3 h-3 rounded-full mr-2"
							style={{ backgroundColor: colors.primary }}
						></span>
						Novos Clientes:{" "}
						<span className="font-semibold text-foreground">
							{payload[0].value}
						</span>
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="border-0 shadow-sm">
			<CardHeader className="pb-4">
				<CardTitle className="text-lg font-semibold flex items-center gap-2">
					<Icon name="chart" size={18} className="text-primary" />
					Visão Geral
				</CardTitle>
				<CardDescription className="text-muted-foreground">
					Acompanhe a adesão de empresas ao longo do tempo
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="h-[280px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data.monthlyData}
							margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.primary}
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor={colors.primary}
										stopOpacity={0.05}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke={colors.mutedForeground}
								opacity={0.2}
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								tickFormatter={formatMonth}
								stroke={colors.mutedForeground}
								fontSize={12}
								tickLine={false}
								axisLine={false}
								dy={10}
							/>
							<YAxis
								tickFormatter={(value) => `${value}`}
								stroke={colors.mutedForeground}
								fontSize={12}
								tickLine={false}
								axisLine={false}
								dx={-10}
								width={60}
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{
									stroke: colors.primary,
									strokeWidth: 1,
									strokeDasharray: "5 5",
								}}
							/>
							<Area
								type="monotone"
								dataKey="newClients"
								stroke={colors.primary}
								strokeWidth={3}
								fill="url(#colorGradient)"
								fillOpacity={1}
								dot={false}
								activeDot={{
									r: 6,
									stroke: colors.primary,
									strokeWidth: 2,
									fill: colors.background,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default OverviewChart;
