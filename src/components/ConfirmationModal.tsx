import { Icon } from "./ui/icon";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    tenantName: string;
    tenantCnpj: string;
    tenantCnae: string;
    tenantCnaeSecundario: string;
    tenantFantasyName: string;
    tenantContactPhone: string;
    tenantRegime: string;
    address: {
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    cpf: string;
  };
  isLoading?: boolean;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, data, isLoading = false }: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl md:min-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Icon name="info" size={24} className="text-blue-600" />
            <span>Confirme seus dados</span>
          </DialogTitle>
          <DialogDescription>Revise todos os dados antes de finalizar o cadastro</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dados da Empresa */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center space-x-2">
              <Icon name="building" size={18} />
              <span>Dados da Empresa</span>
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Razão Social</p>
                  <p className="text-sm text-slate-800">{data.tenantName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nome Fantasia</p>
                  <p className="text-sm text-slate-800">{data.tenantFantasyName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">CNPJ</p>
                  <p className="text-sm text-slate-800">{data.tenantCnpj}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Telefone</p>
                  <p className="text-sm text-slate-800">{data.tenantContactPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">CNAE Principal</p>
                  <p className="text-sm text-slate-800">{data.tenantCnae}</p>
                </div>
                {data.tenantCnaeSecundario && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">CNAE Secundário</p>
                    <p className="text-sm text-slate-800">{data.tenantCnaeSecundario}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 font-medium">Regime Tributário</p>
                  <p className="text-sm text-slate-800">{data.tenantRegime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center space-x-2">
              <Icon name="mapPin" size={18} />
              <span>Endereço</span>
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium">CEP</p>
                  <p className="text-sm text-slate-800">{data.address.zipCode}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Rua</p>
                  <p className="text-sm text-slate-800">{data.address.street}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Número</p>
                  <p className="text-sm text-slate-800">{data.address.number}</p>
                </div>
                {data.address.complement && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Complemento</p>
                    <p className="text-sm text-slate-800">{data.address.complement}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 font-medium">Bairro</p>
                  <p className="text-sm text-slate-800">{data.address.neighborhood}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Cidade</p>
                  <p className="text-sm text-slate-800">{data.address.city}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estado</p>
                  <p className="text-sm text-slate-800">{data.address.state}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">País</p>
                  <p className="text-sm text-slate-800">{data.address.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center space-x-2">
              <Icon name="users" size={18} />
              <span>Responsável</span>
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nome</p>
                  <p className="text-sm text-slate-800">{data.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Sobrenome</p>
                  <p className="text-sm text-slate-800">{data.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">CPF</p>
                  <p className="text-sm text-slate-800">{data.cpf}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Telefone</p>
                  <p className="text-sm text-slate-800">{data.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-medium">E-mail</p>
                  <p className="text-sm text-slate-800">{data.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="h-11">
            <div className="flex items-center space-x-2">
              <Icon name="close" size={16} />
              <span>Cancelar</span>
            </div>
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isLoading} className="h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Enviando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Icon name="check" size={16} />
                <span>Confirmar e Finalizar</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
