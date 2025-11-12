import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatCnpj, formatPhone, formatCpf } from "@/utils/format";
import { type Client } from "@/services/clients";

interface PreApprovalDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (client: Client) => void;
  onReject: (client: Client) => void;
}

export const PreApprovalDetailsModal = ({ client, open, onOpenChange, onApprove, onReject }: PreApprovalDetailsModalProps) => {
  if (!client) return null;

  const { tenant, user } = client;
  const address = tenant.address?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto px-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Icon name="clock" size={28} className="text-amber-600" />
            Detalhes do Pré-Cadastro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">{tenant.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{tenant.fantasyName}</p>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300">
                Aguardando Aprovação
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Icon name="building" size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">CNPJ</p>
                  <p className="text-sm font-bold text-slate-800">{formatCnpj(tenant.cnpj)}</p>
                </div>
              </div>

              {tenant.cnae && (
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Icon name="receipt" size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">CNAE Principal</p>
                    <p className="text-sm font-bold text-slate-800">{tenant.cnae}</p>
                  </div>
                </div>
              )}

              {tenant.cnaeSecundario && (
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Icon name="receipt" size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">CNAE Secundário</p>
                    <p className="text-sm font-bold text-slate-800">{tenant.cnaeSecundario}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Icon name="phone" size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Telefone</p>
                  <p className="text-sm font-bold text-slate-800">{formatPhone(tenant.contactPhone)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="users" size={22} className="text-blue-700" />
              <h4 className="text-lg font-bold text-slate-800">Dados do Responsável</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">Nome Completo</p>
                <p className="text-sm font-bold text-slate-800">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">CPF</p>
                <p className="text-sm font-bold text-slate-800">{formatCpf(user.cpf)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">E-mail</p>
                <p className="text-sm font-bold text-slate-800">{user.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">Telefone</p>
                <p className="text-sm font-bold text-slate-800">{formatPhone(user.phone)}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 font-semibold mb-1">Data do Cadastro</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(client.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {address && (
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="map" size={22} className="text-slate-700" />
                <h4 className="text-lg font-bold text-slate-800">Endereço</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
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
                  <p className="text-xs text-slate-500 font-semibold mb-1">CEP</p>
                  <p className="text-sm font-bold text-slate-800">{address.zipCode}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Cidade</p>
                  <p className="text-sm font-bold text-slate-800">{address.city}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Estado</p>
                  <p className="text-sm font-bold text-slate-800">{address.state}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" onClick={() => onReject(client)} className="h-12 px-6 border-2 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400 font-semibold">
            <Icon name="close" size={18} className="mr-2" />
            Rejeitar Cadastro
          </Button>
          <Button onClick={() => onApprove(client)} className="h-12 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg">
            <Icon name="check" size={18} className="mr-2" />
            Aprovar Cadastro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
