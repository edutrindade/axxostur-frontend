import { Outlet, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
	const location = useLocation();

	// Mapear rotas para activeItem da sidebar
	const getActiveItem = () => {
		const path = location.pathname;
		if (path === "/") return "dashboard";
		if (path.startsWith("/users")) return "users";
		if (path.startsWith("/clients")) return "clients";
		if (path.startsWith("/partners")) return "partners";
		if (path.startsWith("/enterprises")) return "enterprises";
		if (path.startsWith("/tenants")) return "tenants";
		if (path.startsWith("/tax")) return "tax";
		if (path.startsWith("/plans")) return "plans";
		if (path.startsWith("/reports")) return "reports";
		return "dashboard";
	};

	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar activeItem={getActiveItem()} />
			<SidebarInset className="flex-1 min-w-0">
				<main className="flex-1 p-6 md:p-8 overflow-auto w-full min-w-0">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Dashboard;
