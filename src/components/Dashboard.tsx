import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Home from "@/pages/Home";

const Dashboard = () => {
  const location = useLocation();
  const { role, isLoading } = useAuth();

  const isRootPath = location.pathname === "/";

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <main className="flex-1 p-6 md:p-8 overflow-auto w-full min-w-0 flex items-center justify-center">
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
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0">
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

// const AdminHome = () => {
//   return (
//     <div>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Bem-vindo ao AxxosTur, Eduardo Trindade!</h1>
//           <p className="text-slate-600 mt-2">Sua plataforma completa de gestão de viagens</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-blue-200 p-3 rounded-lg">
//                 <span className="text-blue-700 text-2xl">🏢</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Empresas</h3>
//                 <p className="text-sm text-slate-600">Gerencie suas empresas</p>
//                 <p className="text-xs text-slate-500 mt-2">Crie e configure empresas para gerenciar suas operações de viagem.</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-green-200 p-3 rounded-lg">
//                 <span className="text-green-700 text-2xl">📦</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Pacotes</h3>
//                 <p className="text-sm text-slate-600">Crie pacotes de viagem</p>
//                 <p className="text-xs text-slate-500 mt-2">Configure pacotes de viagem com destinos, hotéis e preços.</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-purple-200 p-3 rounded-lg">
//                 <span className="text-purple-700 text-2xl">✈️</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Viagens</h3>
//                 <p className="text-sm text-slate-600">Agende suas viagens</p>
//                 <p className="text-xs text-slate-500 mt-2">Crie datas e agende viagens com base em seus pacotes.</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-yellow-200 p-3 rounded-lg">
//                 <span className="text-yellow-700 text-2xl">💳</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Vendas</h3>
//                 <p className="text-sm text-slate-600">Registre suas vendas</p>
//                 <p className="text-xs text-slate-500 mt-2">Gerencie vendas de pacotes e controle financeiro.</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-red-200 p-3 rounded-lg">
//                 <span className="text-red-700 text-2xl">👥</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Clientes</h3>
//                 <p className="text-sm text-slate-600">Gerencie seus clientes</p>
//                 <p className="text-xs text-slate-500 mt-2">Cadastre e mantenha informações dos seus clientes.</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
//             <div className="flex items-start gap-4">
//               <div className="bg-indigo-200 p-3 rounded-lg">
//                 <span className="text-indigo-700 text-2xl">⚙️</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">Configurações</h3>
//                 <p className="text-sm text-slate-600">Ajuste suas preferências</p>
//                 <p className="text-xs text-slate-500 mt-2">Configure sua conta e preferências da plataforma.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
//           <h2 className="text-2xl font-bold mb-3">Próximos Passos</h2>
//           <p className="text-blue-100 mb-4">Comece a usar a plataforma</p>
//           <ol className="space-y-2 text-blue-100">
//             <li className="flex gap-3">
//               <span className="font-bold">1</span>
//               <span>Crie sua primeira empresa em Empresas</span>
//             </li>
//             <li className="flex gap-3">
//               <span className="font-bold">2</span>
//               <span>Configure hotéis e ônibus para sua empresa</span>
//             </li>
//             <li className="flex gap-3">
//               <span className="font-bold">3</span>
//               <span>Crie seus pacotes de viagem</span>
//             </li>
//             <li className="flex gap-3">
//               <span className="font-bold">4</span>
//               <span>Agende viagens e comece a vender</span>
//             </li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// };

export default Dashboard;
