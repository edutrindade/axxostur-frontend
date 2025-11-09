export interface DashboardCards {
	totalEnterprises: number;
	activeEnterprises: number;
	activePartners: number;
	monthlyRevenue: number;
	monthlyRevenueFormatted: string;
}

export interface MonthlyData {
	month: string;
	newClients: number;
}

export interface DashboardOverview {
	monthlyData: MonthlyData[];
	cancellationRate: number;
	retentionRate: number;
	totalNewClients: number;
}
