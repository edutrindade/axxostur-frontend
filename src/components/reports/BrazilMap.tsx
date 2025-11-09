import { useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import { formatCurrency } from "@/utils/format";

interface BrazilMapProps {
	brazilStatesData: Record<
		string,
		{ companies: number; revenue: number; color: string }
	>;
}

export const BrazilMap = ({ brazilStatesData }: BrazilMapProps) => {
	const [hoveredState, setHoveredState] = useState<string | null>(null);

	const brazilGeoUrl =
		"https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

	const getStateColor = (stateName: string) => {
		const stateData =
			brazilStatesData[stateName as keyof typeof brazilStatesData];
		if (!stateData) return "#f1f5f9";
		return stateData.color;
	};

	return (
		<div className="relative">
			<ComposableMap
				projection="geoMercator"
				projectionConfig={{
					scale: 520,
					center: [-54, -15],
				}}
				width={800}
				height={400}
				className="w-full h-[400px] border rounded-lg bg-background"
			>
				<ZoomableGroup zoom={1}>
					<Geographies geography={brazilGeoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const stateName =
									geo.properties.name ||
									geo.properties.NAME ||
									geo.properties.NAME_1;
								const stateData =
									brazilStatesData[stateName as keyof typeof brazilStatesData];

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={getStateColor(stateName)}
										stroke="#e2e8f0"
										strokeWidth={0.5}
										style={{
											default: {
												outline: "none",
												cursor: "pointer",
											},
											hover: {
												outline: "none",
												opacity: 0.8,
												cursor: "pointer",
											},
											pressed: {
												outline: "none",
											},
										}}
										onMouseEnter={() => setHoveredState(stateName)}
										onMouseLeave={() => setHoveredState(null)}
										onClick={() => {
											console.log(`Clicou em: ${stateName}`, stateData);
										}}
									/>
								);
							})
						}
					</Geographies>
				</ZoomableGroup>
			</ComposableMap>

			{hoveredState && (
				<div className="absolute top-4 left-4 bg-background border rounded-lg p-3 shadow-lg z-10 min-w-[200px]">
					{(() => {
						const stateData =
							brazilStatesData[hoveredState as keyof typeof brazilStatesData];
						return stateData ? (
							<div>
								<div className="font-semibold text-lg">{hoveredState}</div>
								<div className="text-sm text-muted-foreground mt-1">
									<div className="flex justify-between">
										<span>Empresas:</span>
										<span className="font-medium">{stateData.companies}</span>
									</div>
									<div className="flex justify-between mt-1">
										<span>Faturamento:</span>
										<span className="font-medium">
											{formatCurrency(stateData.revenue)}
										</span>
									</div>
								</div>
							</div>
						) : (
							<div>
								<div className="font-semibold">{hoveredState}</div>
								<div className="text-sm text-muted-foreground">
									Sem dados disponíveis
								</div>
							</div>
						);
					})()}
				</div>
			)}

			<div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#1e3a8a" }}
					></div>
					<span>100+ empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#1e40af" }}
					></div>
					<span>70-99 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#2563eb" }}
					></div>
					<span>50-69 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#3b82f6" }}
					></div>
					<span>30-49 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#60a5fa" }}
					></div>
					<span>20-29 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#93c5fd" }}
					></div>
					<span>10-19 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#bfdbfe" }}
					></div>
					<span>5-9 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div
						className="w-4 h-4 rounded"
						style={{ backgroundColor: "#dbeafe" }}
					></div>
					<span>1-4 empresas</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-4 h-4 bg-gray-200 rounded"></div>
					<span>Sem dados</span>
				</div>
			</div>
		</div>
	);
};
