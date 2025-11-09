import { api } from "./api";
import type { DashboardCards, DashboardOverview } from "@/types/dashboard";

export const dashboardService = {
	async getCards(): Promise<DashboardCards> {
		const response = await api.get("/dashboard/admin/cards");
		return response.data;
	},

	async getOverviewChart(): Promise<DashboardOverview> {
		const response = await api.get("/dashboard/admin/overview-chart");
		return response.data;
	},
};
