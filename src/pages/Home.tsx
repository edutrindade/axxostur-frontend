import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">Bem-vindo ao AxxosTur, {user?.name}!</h1>
            <p className="text-xl text-slate-600">Sua plataforma completa de gestão de viagens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon name="building" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Empresas</CardTitle>
                    <CardDescription>Gerencie suas empresas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Crie e configure empresas para gerenciar suas operações de viagem.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Icon name="map" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pacotes</CardTitle>
                    <CardDescription>Crie pacotes de viagem</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Configure pacotes de viagem com destinos, hotéis e preços.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Icon name="calendar" size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Viagens</CardTitle>
                    <CardDescription>Agende suas viagens</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Crie datas e agende viagens com base em seus pacotes.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Icon name="dollar" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Vendas</CardTitle>
                    <CardDescription>Registre suas vendas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Gerencie vendas de pacotes e controle financeiro.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Icon name="users" size={24} className="text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Clientes</CardTitle>
                    <CardDescription>Gerencie seus clientes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Cadastre e mantenha informações dos seus clientes.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Icon name="settings" size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configurações</CardTitle>
                    <CardDescription>Ajuste suas preferências</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Configure sua conta e preferências da plataforma.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-white">Próximos Passos</CardTitle>
              <CardDescription className="text-blue-100">Comece a usar a plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-white/20 rounded-full text-sm font-semibold">1</span>
                <span>Crie sua primeira empresa em Empresas</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-white/20 rounded-full text-sm font-semibold">2</span>
                <span>Configure hotéis e ônibus para sua empresa</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-white/20 rounded-full text-sm font-semibold">3</span>
                <span>Crie seus pacotes de viagem</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-white/20 rounded-full text-sm font-semibold">4</span>
                <span>Agende viagens e comece a vender</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
