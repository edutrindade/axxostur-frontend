import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatCnpj, formatPhone, formatCpf } from "@/utils/format";
import { type Client } from "@/services/clients";

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailsModal = ({ client, open, onOpenChange }: ClientDetailsModalProps) => {
  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}`, "_blank");
    }
  };

  if (!client) return null;

  const { tenant } = client;
  const address = tenant.address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Informações da Empresa - Full Width */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{tenant.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{tenant.fantasyName}</p>
              </div>
              <Badge variant={tenant.active ? "success" : "destructive"} className="text-sm px-3 py-1">
                {tenant.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon name="building" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">CNPJ</p>
                  <p className="text-sm font-bold text-slate-800">{formatCnpj(tenant.cnpj)}</p>
                </div>
              </div>

              {tenant.cnae && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Icon name="receipt" size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">CNAE</p>
                    <p className="text-sm font-bold text-slate-800">{tenant.cnae}</p>
                  </div>
                </div>
              )}
            </div>

            {tenant.notes && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-slate-500 font-semibold mb-1">Observações</p>
                <p className="text-sm text-slate-700">{tenant.notes}</p>
              </div>
            )}
          </div>

          {/* Grid de 2 colunas para os demais cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Responsável */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="users" size={20} className="text-slate-700" />
                <h4 className="text-lg font-bold text-slate-800">Responsável</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Nome</p>
                  <p className="text-sm font-bold text-slate-800">
                    {client.firstName} {client.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">CPF</p>
                  <p className="text-sm font-bold text-slate-800">{formatCpf(client.cpf)}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">E-mail</p>
                  <p className="text-sm font-bold text-slate-800">{client.email}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Telefone</p>
                  <p className="text-sm font-bold text-slate-800">{formatPhone(client.phone)}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Data de Cadastro</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(client.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Contato da Empresa */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="phone" size={20} className="text-slate-700" />
                <h4 className="text-lg font-bold text-slate-800">Contato</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Nome do Contato</p>
                  <p className="text-sm font-bold text-slate-800">{tenant.contactName}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Telefone do Contato</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{formatPhone(tenant.contactPhone)}</p>
                    {tenant.contactPhone && (
                      <button type="button" className="h-9 w-9 p-1 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => handleWhatsApp(tenant.contactPhone)}>
                        <img src="/src/assets/icons/wpp.png" alt="WhatsApp" className="w-full h-full" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço - Ocupa toda a largura em mobile, 1 coluna em desktop */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="mapPin" size={20} className="text-slate-700" />
                <h4 className="text-lg font-bold text-slate-800">Endereço</h4>
              </div>

              {address ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Logradouro</p>
                    <p className="text-sm font-bold text-slate-800">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">Bairro</p>
                    <p className="text-sm font-bold text-slate-800">{address.neighborhood}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">Cidade/Estado</p>
                    <p className="text-sm font-bold text-slate-800">
                      {address.city} - {address.state}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">CEP</p>
                    <p className="text-sm font-bold text-slate-800">{address.zipCode}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">País</p>
                    <p className="text-sm font-bold text-slate-800">{address.country}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500">Nenhum endereço cadastrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
