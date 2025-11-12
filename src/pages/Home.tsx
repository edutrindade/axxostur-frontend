import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import type { IconName } from "@/components/ui/icon";

const Home = () => {
  const { isAdmin } = useAuth();

  const adminStats = useMemo(
    () => [
      { key: "clients", title: "Clientes", value: 128, icon: "users" as IconName, color: "text-blue-700", bg: "from-blue-50 to-blue-100/50 border-blue-200", iconBg: "bg-blue-100" },
      { key: "users", title: "Usuários", value: 342, icon: "users" as IconName, color: "text-purple-700", bg: "from-purple-50 to-purple-100/50 border-purple-200", iconBg: "bg-purple-100" },
      { key: "pending", title: "Cadastros Pendentes", value: 15, icon: "clock" as IconName, color: "text-amber-700", bg: "from-amber-50 to-amber-100/50 border-amber-200", iconBg: "bg-amber-100" },
      { key: "queries", title: "Consultas", value: 4521, icon: "search" as IconName, color: "text-orange-700", bg: "from-orange-50 to-orange-100/50 border-orange-200", iconBg: "bg-orange-100" },
    ],
    []
  );

  const clientStats = useMemo(
    () => [
      { key: "plan", title: "Plano Atual", value: "Básico", icon: "shield" as IconName, color: "text-blue-700", bg: "from-blue-50 to-blue-100/50 border-blue-200", iconBg: "bg-blue-100" },
      { key: "queries", title: "Consultas Realizadas", value: 47, icon: "search" as IconName, color: "text-purple-700", bg: "from-purple-50 to-purple-100/50 border-purple-200", iconBg: "bg-purple-100" },
      { key: "pending", title: "Consultas Pendentes", value: 3, icon: "clock" as IconName, color: "text-amber-700", bg: "from-amber-50 to-amber-100/50 border-amber-200", iconBg: "bg-amber-100" },
      { key: "limit", title: "Limite Mensal", value: "100", icon: "trending" as IconName, color: "text-green-700", bg: "from-green-50 to-green-100/50 border-green-200", iconBg: "bg-green-100" },
    ],
    []
  );

  const stats = isAdmin ? adminStats : clientStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AppHeader title="Dashboard" />
      <div className="flex flex-1 flex-col gap-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 tracking-tight">Bem-vindo ao Nexxus</h1>
          <p className="text-slate-600 text-xl font-medium leading-relaxed">Gerencie seus dados e acompanhe o desempenho da sua plataforma com facilidade e eficiência.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.key} className={`bg-gradient-to-br ${stat.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 cursor-pointer group`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={stat.icon} size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</div>
                <p className="text-xs text-slate-500 font-medium">{isAdmin ? "Total registrado" : stat.key === "plan" ? "Plano contratado" : "Total"}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Icon name="trending" size={24} className="text-blue-600" />
                {isAdmin ? "Atividade Recente" : "Minhas Consultas Recentes"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isAdmin ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-sm text-slate-700 font-semibold flex-1">Novo cliente aprovado</span>
                    <span className="text-xs text-slate-500 font-medium">2 min atrás</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                    <span className="text-sm text-slate-700 font-semibold flex-1">Pré-cadastro recebido</span>
                    <span className="text-xs text-slate-500 font-medium">5 min atrás</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                    <span className="text-sm text-slate-700 font-semibold flex-1">Nova consulta realizada</span>
                    <span className="text-xs text-slate-500 font-medium">8 min atrás</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-700 font-semibold block">Consulta Fiscal - GTIN</span>
                      <span className="text-xs text-slate-500">7891234567890 • NCM: 8517.62.55</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">15 min atrás</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-700 font-semibold block">Consulta Fiscal - GTIN</span>
                      <span className="text-xs text-slate-500">7899876543210 • NCM: 3304.99.10</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">1 hora atrás</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-700 font-semibold block">Consulta Fiscal - GTIN</span>
                      <span className="text-xs text-slate-500">7896543210987 • NCM: 2106.90.10</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">2 horas atrás</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Icon name="info" size={24} className="text-purple-600" />
                {isAdmin ? "Resumo do Sistema" : "Informações da Conta"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isAdmin ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Status do Sistema</span>
                    <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Última Atualização</span>
                    <span className="text-sm text-slate-700 font-bold">Hoje, 14:30</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Versão</span>
                    <span className="text-sm text-slate-700 font-bold">v2.1.0</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Data de Início</span>
                    <span className="text-sm text-slate-700 font-bold">01/01/2025</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Plano Contratado</span>
                    <span className="text-sm font-bold text-blue-700 flex items-center gap-2">
                      <Icon name="shield" size={16} className="text-blue-600" />
                      Básico
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Próxima Renovação</span>
                    <span className="text-sm text-slate-700 font-bold">01/12/2025</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                    <span className="text-sm text-slate-600 font-semibold">Status da Conta</span>
                    <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      Ativa
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
