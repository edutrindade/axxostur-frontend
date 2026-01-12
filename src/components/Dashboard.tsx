import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";

const Dashboard = () => {
  const location = useLocation();
  const { role, isLoading } = useAuth();

  const isRootPath = location.pathname === "/";

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={window.innerWidth >= 768}>
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0 flex flex-col">
          <Navbar />
          <main className="flex-1 min-w-0 overflow-auto w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={window.innerWidth >= 768}>
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto w-full min-w-0">{isRootPath ? role === "super_admin" ? <SuperAdminHome /> : <AdminHome /> : <Outlet />}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const SuperAdminHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total de Empresas</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">12</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-blue-600 text-xl">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">48</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Vendas do Mês</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">R$ 125k</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <span className="text-orange-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Crescimento</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">+23%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Empresas Recentes</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-700">Nexxus Turismo</span>
            <span className="text-sm text-slate-500">Há 2 horas</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-700">Travel Company XYZ</span>
            <span className="text-sm text-slate-500">Há 1 dia</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-slate-700">Tourism Solutions</span>
            <span className="text-sm text-slate-500">Há 3 dias</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  return <Home />;
};

export default Dashboard;
