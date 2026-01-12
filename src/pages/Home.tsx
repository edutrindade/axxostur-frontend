import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { UpcomingTripsCard } from "@/components/dashboard/UpcomingTripsCard";
import FirstAccessPasswordModal from "@/components/FirstAccessPasswordModal";

const Home = () => {
  const { user, role, company } = useAuth();
  const navigate = useNavigate();
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false);

  useEffect(() => {
    if (user?.firstAccess) {
      setShowFirstAccessModal(true);
    }
  }, [user?.firstAccess]);

  const adminDashboardData = useMemo(
    () => ({
      stats: [
        { label: "Clientes", value: 0, image: "/src/assets/img/clients.png" },
        { label: "Viajantes", value: 0, image: "/src/assets/img/traveler.png" },
        { label: "Ônibus", value: 0, image: "/src/assets/img/bus.png" },
        { label: "Hotéis", value: 0, image: "/src/assets/img/hotel.png" },
      ],
      registrations: [
        { label: "Clientes", iconName: "users", color: "bg-red-500" },
        { label: "Ônibus", iconName: "bus", color: "bg-blue-500" },
        { label: "Hotéis", iconName: "home", color: "bg-purple-500" },
        { label: "Pacotes", iconName: "package", color: "bg-green-500" },
      ],
      trips: [
        { date: "15/01/2026", packageName: "PACOTE DE VIAGEM - PORTO FORMANDOS", passengers: 20 },
        { date: "22/01/2026", packageName: "PACOTE DE VIAGEM - APARECIDA DO NORTE", passengers: 15 },
        { date: "28/01/2026", packageName: "PACOTE DE VIAGEM - GUARAPARI", passengers: 25 },
      ],
      steps: [
        { number: 1, text: "Cadastrar clientes", completed: true },
        { number: 2, text: "Cadastrar hotéis", completed: false },
        { number: 3, text: "Criar primeiro pacote", completed: false },
        { number: 4, text: "Agendar viagem", completed: false },
      ],
    }),
    []
  );

  const handleRegistrationAction = (action: string) => {
    const routes: Record<string, string> = {
      Clientes: "/registrations/customers",
      Viajantes: "/registrations/travelers",
      Ônibus: "/registrations/buses",
      Hotéis: "/registrations/hotels",
    };
    navigate(routes[action] || "/");
  };

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">Bem-vindo ao AxxosTur, {user?.name.split(" ")[0]}!</h1>
            <p className="text-xl text-slate-600">A plataforma completa de gestão de viagens para sua empresa</p>
          </div>
        </div>

        {company && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-blue-700 font-medium">EMPRESA</p>
              <h2 className="text-2xl font-bold text-blue-900">{company.fantasyName}</h2>
            </div>
            <div className="text-right">{company.logoUrl && <img src={company.logoUrl} alt={company.name} className="h-16  object-contain" />}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminDashboardData.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionCard title="Cadastros" description="Gerencie todos os dados da sua empresa" actions={adminDashboardData.registrations} onActionClick={handleRegistrationAction} />

        <FeatureCard
          title="Pacotes e Viagens"
          description="Crie pacotes e agende datas"
          iconName="map"
          iconColor="text-green-600"
          bgColor="bg-green-100"
          stats={[
            { label: "Pacotes", value: 0 },
            { label: "Viagens Agendadas", value: 0 },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          title="Vendas"
          description="Realize vendas de pacotes"
          iconName="dollar"
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
          stats={[
            { label: "Vendas do Mês", value: "R$ 0.000" },
            { label: "Total de Vendas", value: 0 },
          ]}
        />

        <FeatureCard
          title="Financeiro"
          description="Controle financeiro"
          iconName="chart"
          iconColor="text-indigo-600"
          bgColor="bg-indigo-100"
          stats={[
            { label: "Contas a Receber", value: "R$ 0,00" },
            { label: "Saldo em Caixa", value: "R$ 0,00" },
          ]}
        />
      </div>

      <UpcomingTripsCard trips={adminDashboardData.trips} />

      {/* <NextStepsCard steps={adminDashboardData.steps} /> */}
    </div>
  );

  const renderSuperAdminDashboard = () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Bem-vindo ao AxxosTur, {user?.name}!</h1>
        <p className="text-xl text-slate-600">Visão geral do sistema</p>
      </div>

      <FeatureCard
        title="Gerenciamento de Empresas"
        description="Visualize e gerencie todas as empresas"
        iconName="building"
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        stats={[
          { label: "Empresas Ativas", value: 12 },
          { label: "Empresas Inativos", value: 2 },
        ]}
      />
    </div>
  );

  const renderAttendantDashboard = () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Bem-vindo ao AxxosTur, {user?.name}!</h1>
        <p className="text-xl text-slate-600">Ponto de Venda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          title="Vendas"
          description="Realize vendas de pacotes"
          iconName="dollar"
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
          stats={[
            { label: "Vendas de Hoje", value: 3 },
            { label: "Total Hoje", value: "R$ 8.500" },
          ]}
        />

        <FeatureCard
          title="Clientes"
          description="Visualize clientes cadastrados"
          iconName="users"
          iconColor="text-red-600"
          bgColor="bg-red-100"
          stats={[
            { label: "Total de Clientes", value: 24 },
            { label: "Ativos", value: 22 },
          ]}
        />
      </div>

      <UpcomingTripsCard trips={[{ date: "15/01/2026", packageName: "Pacote Rio de Janeiro", passengers: 20 }]} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {role === "admin" && renderAdminDashboard()}
        {role === "super_admin" && renderSuperAdminDashboard()}
        {role === "attendant" && renderAttendantDashboard()}
      </div>

      {showFirstAccessModal && user && <FirstAccessPasswordModal userName={user.name} onSuccess={() => setShowFirstAccessModal(false)} />}
    </div>
  );
};

export default Home;
