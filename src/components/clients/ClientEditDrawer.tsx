import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";
import { formatCnpj, formatPhone, formatCpf } from "@/utils/format";
import { type Client } from "@/services/clients";

interface ClientEditDrawerProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: any) => void;
  isSaving: boolean;
}

interface FormData {
  // Dados da empresa
  tenantName: string;
  tenantFantasyName: string;
  tenantCnpj: string;
  tenantContactPhone: string;
  tenantNotes: string;

  // Dados do responsável
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;

  // Endereço
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const ClientEditDrawer = ({ client, open, onOpenChange, onSave, isSaving }: ClientEditDrawerProps) => {
  const [formData, setFormData] = useState<FormData>({
    tenantName: "",
    tenantFantasyName: "",
    tenantCnpj: "",
    tenantContactPhone: "",
    tenantNotes: "",
    firstName: "",
    lastName: "",
    cpf: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [originalData, setOriginalData] = useState<FormData | null>(null);

  useEffect(() => {
    if (client && open) {
      const address = client.tenant.address;
      const data: FormData = {
        tenantName: client.tenant.name || "",
        tenantFantasyName: client.tenant.fantasyName || "",
        tenantCnpj: client.tenant.cnpj || "",
        tenantContactPhone: client.tenant.contactPhone || "",
        tenantNotes: client.tenant.notes || "",
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        cpf: client.cpf || "",
        phone: client.phone || "",
        street: address?.street || "",
        number: address?.number || "",
        complement: address?.complement || "",
        neighborhood: address?.neighborhood || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        country: address?.country || "Brasil",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [client, open]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!client || !originalData) return;

    // Construir objeto apenas com campos alterados
    const changes: any = {};

    // Verificar mudanças nos dados da empresa
    if (formData.tenantName !== originalData.tenantName) changes.tenantName = formData.tenantName;
    if (formData.tenantFantasyName !== originalData.tenantFantasyName) changes.tenantFantasyName = formData.tenantFantasyName;
    // CNPJ não pode ser editado
    if (formData.tenantContactPhone !== originalData.tenantContactPhone) changes.tenantContactPhone = formData.tenantContactPhone;
    if (formData.tenantNotes !== originalData.tenantNotes) changes.tenantNotes = formData.tenantNotes;

    // Verificar mudanças nos dados do responsável
    if (formData.firstName !== originalData.firstName) changes.firstName = formData.firstName;
    if (formData.lastName !== originalData.lastName) changes.lastName = formData.lastName;
    if (formData.cpf !== originalData.cpf) changes.cpf = formData.cpf;
    if (formData.phone !== originalData.phone) changes.phone = formData.phone;

    // Verificar mudanças no endereço
    const addressChanges: any = {};
    if (formData.street !== originalData.street) addressChanges.street = formData.street;
    if (formData.number !== originalData.number) addressChanges.number = formData.number;
    if (formData.complement !== originalData.complement) addressChanges.complement = formData.complement;
    if (formData.neighborhood !== originalData.neighborhood) addressChanges.neighborhood = formData.neighborhood;
    if (formData.city !== originalData.city) addressChanges.city = formData.city;
    if (formData.state !== originalData.state) addressChanges.state = formData.state;
    if (formData.zipCode !== originalData.zipCode) addressChanges.zipCode = formData.zipCode;
    if (formData.country !== originalData.country) addressChanges.country = formData.country;

    if (Object.keys(addressChanges).length > 0) {
      changes.address = addressChanges;
    }

    // Se não houver mudanças, não fazer nada
    if (Object.keys(changes).length === 0) {
      onOpenChange(false);
      return;
    }

    onSave(client.id, changes);
  };

  if (!client) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[90vw] sm:min-w-[700px] lg:min-w-[900px] p-0 flex flex-col max-h-screen">
        <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
          <SheetTitle className="text-2xl">Editar Cliente</SheetTitle>
          <SheetDescription>Atualize as informações do cliente e da empresa.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-6 space-y-8 overflow-y-auto flex-1">
            {/* Dados da Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Icon name="building" size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">Dados da Empresa</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Razão Social *</Label>
                  <Input id="tenantName" leftIcon="building" value={formData.tenantName} onChange={(e) => handleInputChange("tenantName", e.target.value)} placeholder="Digite a razão social" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantFantasyName">Nome Fantasia</Label>
                  <Input id="tenantFantasyName" leftIcon="building" value={formData.tenantFantasyName} onChange={(e) => handleInputChange("tenantFantasyName", e.target.value)} placeholder="Digite o nome fantasia" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantCnpj">CNPJ</Label>
                  <Input id="tenantCnpj" leftIcon="creditCard" value={formatCnpj(formData.tenantCnpj)} placeholder="00.000.000/0000-00" disabled className="bg-slate-100 cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantContactPhone">Telefone de Contato</Label>
                  <Input id="tenantContactPhone" leftIcon="phone" value={formatPhone(formData.tenantContactPhone)} onChange={(e) => handleInputChange("tenantContactPhone", e.target.value)} placeholder="(00) 00000-0000" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tenantNotes">Observações</Label>
                  <Textarea id="tenantNotes" value={formData.tenantNotes} onChange={(e) => handleInputChange("tenantNotes", e.target.value)} placeholder="Observações sobre a empresa" rows={3} />
                </div>
              </div>
            </div>

            {/* Dados do Responsável */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Icon name="users" size={20} className="text-green-600" />
                <h3 className="text-lg font-bold text-slate-800">Dados do Responsável</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input id="firstName" leftIcon="userPlus" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} placeholder="Digite o nome" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" leftIcon="userPlus" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} placeholder="Digite o sobrenome" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" leftIcon="creditCard" value={formatCpf(formData.cpf)} onChange={(e) => handleInputChange("cpf", e.target.value)} placeholder="000.000.000-00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" leftIcon="phone" value={formatPhone(formData.phone)} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Icon name="mapPin" size={20} className="text-purple-600" />
                <h3 className="text-lg font-bold text-slate-800">Endereço</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Logradouro</Label>
                  <Input id="street" leftIcon="mapPin" value={formData.street} onChange={(e) => handleInputChange("street", e.target.value)} placeholder="Rua, Avenida, etc" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" value={formData.number} onChange={(e) => handleInputChange("number", e.target.value)} placeholder="Nº" />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" value={formData.complement} onChange={(e) => handleInputChange("complement", e.target.value)} placeholder="Apartamento, sala, etc" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => handleInputChange("neighborhood", e.target.value)} placeholder="Digite o bairro" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Digite a cidade" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} placeholder="UF" maxLength={2} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} placeholder="00000-000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} placeholder="País" />
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0 bg-white">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              <Icon name="check" size={16} className="mr-2 text-white" />
              <span className="text-white font-bold">{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 text-slate-700" disabled={isSaving}>
              <span className="font-bold">Cancelar</span>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
