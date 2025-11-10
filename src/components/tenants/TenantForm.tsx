import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toast";
import { formatCnpj, formatPhone } from "@/utils/format";
import { createTenant, updateTenant, type Tenant, type CreateTenantData } from "@/services/tenants";

interface TenantFormProps {
  onSuccess?: () => void;
  initialData?: Tenant;
}

export const TenantForm = ({ onSuccess, initialData }: TenantFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTenantData>({
    name: "",
    cnpj: "",
    cnae: null,
    cnaeSecundario: null,
    fantasyName: null,
    logoUrl: null,
    notes: null,
    contactName: null,
    contactPhone: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        cnpj: initialData.cnpj,
        cnae: null,
        cnaeSecundario: null,
        fantasyName: initialData.fantasyName ?? null,
        logoUrl: null,
        notes: null,
        contactName: initialData.contactName ?? null,
        contactPhone: initialData.contactPhone ?? null,
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CreateTenantData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cnpj) {
      toast.error("Erro", { description: "Nome e CNPJ são obrigatórios." });
      return;
    }
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateTenant(initialData.id, formData);
        toast.success("Sucesso", { description: "Empresa atualizada com sucesso!" });
      } else {
        await createTenant(formData);
        toast.success("Sucesso", { description: "Empresa cadastrada com sucesso!" });
      }
      onSuccess?.();
    } catch (error: unknown) {
      toast.error("Erro", { description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Falha ao salvar empresa." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="name">Razão Social *</Label>
        <Input id="name" leftIcon="building" value={formData.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Digite a razão social" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ *</Label>
        <Input id="cnpj" leftIcon="creditCard" value={formatCnpj(formData.cnpj || "")} onChange={(e) => handleInputChange("cnpj", e.target.value)} placeholder="00.000.000/0000-00" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fantasyName">Nome Fantasia</Label>
        <Input id="fantasyName" leftIcon="tag" value={formData.fantasyName || ""} onChange={(e) => handleInputChange("fantasyName", e.target.value)} placeholder="Digite o nome fantasia" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnae">CNAE</Label>
          <Input id="cnae" leftIcon="file" value={formData.cnae || ""} onChange={(e) => handleInputChange("cnae", e.target.value)} placeholder="Digite o CNAE" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnaeSecundario">CNAE Secundário</Label>
          <Input id="cnaeSecundario" leftIcon="file" value={formData.cnaeSecundario || ""} onChange={(e) => handleInputChange("cnaeSecundario", e.target.value)} placeholder="Digite o CNAE secundário" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logomarca</Label>
        <Input id="logoUrl" leftIcon="image" value={formData.logoUrl || ""} onChange={(e) => handleInputChange("logoUrl", e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input id="notes" leftIcon="comment" value={formData.notes || ""} onChange={(e) => handleInputChange("notes", e.target.value)} placeholder="Anotações sobre a empresa" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Contato *</Label>
          <Input id="contactName" leftIcon="userCheck" value={formData.contactName || ""} onChange={(e) => handleInputChange("contactName", e.target.value)} placeholder="Nome do contato" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Telefone *</Label>
          <Input id="contactPhone" leftIcon="phone" value={formatPhone(formData.contactPhone || "")} onChange={(e) => handleInputChange("contactPhone", e.target.value)} placeholder="(11) 99999-9999" required />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          <Icon name="check" size={16} className="mr-2 text-white" />
          <span className="text-white font-bold">{initialData ? "Atualizar" : "Cadastrar"}</span>
        </Button>
        <Button type="button" variant="outline" className="flex-1 text-slate-700" onClick={() => onSuccess?.()}>
          <span className="font-bold">Cancelar</span>
        </Button>
      </div>
    </form>
  );
};
