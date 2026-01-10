import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/services/companies";
import { formatCnpj, formatPhone, cleanCnpj, cleanPhone } from "@/utils/format";

const TAX_REGIME_MAP = {
  MEI: "MEI",
  SN: "Simples Nacional",
  LP: "Lucro Presumido",
  LR: "Lucro Real",
} as const;

const TAX_REGIME_REVERSE_MAP = {
  MEI: "MEI",
  "Simples Nacional": "SN",
  "Lucro Presumido": "LP",
  "Lucro Real": "LR",
} as const;

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCompanyRequest | UpdateCompanyRequest) => void;
  isLoading: boolean;
  company?: Company;
  title: string;
  description: string;
}

export const CompanyFormDialog = ({ open, onOpenChange, onSubmit, isLoading, company, title, description }: CompanyFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    fantasyName: "",
    cnpj: "",
    responsible: "",
    email: "",
    phone: "",
    cnae: "",
    taxRegime: "",
    logoUrl: "",
    primaryColor: "#000000",
    secondaryColor: "#000000",
    tertiaryColor: "#000000",
  });

  useEffect(() => {
    if (company) {
      // Converte o valor salvo (ex: "LP") para o valor exibido (ex: "Lucro Presumido")
      const displayTaxRegime = company.taxRegime && TAX_REGIME_MAP[company.taxRegime as keyof typeof TAX_REGIME_MAP] ? TAX_REGIME_MAP[company.taxRegime as keyof typeof TAX_REGIME_MAP] : "";

      setFormData({
        name: company.name || "",
        fantasyName: company.fantasyName || "",
        cnpj: formatCnpj(company.cnpj) || "",
        responsible: company.responsible || "",
        email: company.email || "",
        phone: formatPhone(company.phone) || "",
        cnae: company.cnae || "",
        taxRegime: displayTaxRegime,
        logoUrl: company.logoUrl || "",
        primaryColor: company.primaryColor || "#000000",
        secondaryColor: company.secondaryColor || "#000000",
        tertiaryColor: company.tertiaryColor || "#000000",
      });
    } else {
      setFormData({
        name: "",
        fantasyName: "",
        cnpj: "",
        responsible: "",
        email: "",
        phone: "",
        cnae: "",
        taxRegime: "",
        logoUrl: "",
        primaryColor: "#000000",
        secondaryColor: "#000000",
        tertiaryColor: "#000000",
      });
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.cnpj || !formData.email || !formData.responsible) {
      alert("Por favor, preencha todos os campos obrigatórios: Nome, CNPJ, Email e Responsável");
      return;
    }

    const saveTaxRegime = formData.taxRegime ? TAX_REGIME_REVERSE_MAP[formData.taxRegime as keyof typeof TAX_REGIME_REVERSE_MAP] : "";

    const DEFAULT_COLOR = "#000000";

    if (company) {
      const updateData: UpdateCompanyRequest = {};
      if (formData.name !== company.name) updateData.name = formData.name;
      if (formData.fantasyName !== (company.fantasyName || "")) updateData.fantasyName = formData.fantasyName;
      if (formData.responsible !== company.responsible) updateData.responsible = formData.responsible;
      if (cleanPhone(formData.phone) !== company.phone) updateData.phone = cleanPhone(formData.phone);
      if (formData.email !== company.email) updateData.email = formData.email;
      if (formData.cnae !== (company.cnae || "")) updateData.cnae = formData.cnae;
      if (saveTaxRegime !== (company.taxRegime || "")) updateData.taxRegime = saveTaxRegime;
      if (formData.logoUrl !== (company.logoUrl || "")) updateData.logoUrl = formData.logoUrl;
      if (formData.primaryColor !== DEFAULT_COLOR && formData.primaryColor !== (company.primaryColor || "")) updateData.primaryColor = formData.primaryColor;
      if (formData.secondaryColor !== DEFAULT_COLOR && formData.secondaryColor !== (company.secondaryColor || "")) updateData.secondaryColor = formData.secondaryColor;
      if (formData.tertiaryColor !== DEFAULT_COLOR && formData.tertiaryColor !== (company.tertiaryColor || "")) updateData.tertiaryColor = formData.tertiaryColor;
      onSubmit(updateData);
    } else {
      const createData: CreateCompanyRequest = {
        name: formData.name,
        cnpj: cleanCnpj(formData.cnpj),
        responsible: formData.responsible,
        email: formData.email,
        fantasyName: formData.fantasyName,
        phone: cleanPhone(formData.phone),
        cnae: formData.cnae,
        taxRegime: saveTaxRegime,
        logoUrl: formData.logoUrl,
        ...(formData.primaryColor !== DEFAULT_COLOR && { primaryColor: formData.primaryColor }),
        ...(formData.secondaryColor !== DEFAULT_COLOR && { secondaryColor: formData.secondaryColor }),
        ...(formData.tertiaryColor !== DEFAULT_COLOR && { tertiaryColor: formData.tertiaryColor }),
      };
      onSubmit(createData);
    }

    setFormData({
      name: "",
      fantasyName: "",
      cnpj: "",
      responsible: "",
      email: "",
      phone: "",
      cnae: "",
      taxRegime: "",
      logoUrl: "",
      primaryColor: "#000000",
      secondaryColor: "#000000",
      tertiaryColor: "#000000",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:border-r md:pr-6">
              <h3 className="text-base font-semibold text-slate-900">Informações Básicas</h3>

              {!company && (
                <>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Nome da Empresa <span className="text-red-500">*</span>
                    </label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Razão social" required disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      CNPJ <span className="text-red-500">*</span>
                    </label>
                    <Input value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })} placeholder="XX.XXX.XXX/XXXX-XX" required disabled={isLoading} maxLength={18} />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Nome Fantasia</label>
                <Input value={formData.fantasyName} onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })} placeholder="Nome comercial" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">
                  Responsável <span className="text-red-500">*</span>
                </label>
                <Input value={formData.responsible} onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} placeholder="Nome do responsável" required disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Contato</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="empresa@exemplo.com" required disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Telefone</label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(XX) 9 XXXX-XXXX" disabled={isLoading} maxLength={14} />
              </div>
            </div>
          </div>

          <div className="border-t" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:border-r md:pr-6">
              <h3 className="text-base font-semibold text-slate-900">Informações Fiscais</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">CNAE</label>
                <Input value={formData.cnae} onChange={(e) => setFormData({ ...formData, cnae: e.target.value })} placeholder="Ex: 4790-01-00" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Regime Tributário</label>
                <Select value={formData.taxRegime} onValueChange={(value) => setFormData({ ...formData, taxRegime: value })} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um regime tributário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEI">MEI</SelectItem>
                    <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                    <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="Lucro Real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Branding</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">URL do Logo</label>
                <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://..." disabled={isLoading} />
                {formData.logoUrl && <img src={formData.logoUrl} alt="Logo preview" className="max-h-20 max-w-20 rounded border" />}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <ColorPicker value={formData.primaryColor} onChange={(color) => setFormData({ ...formData, primaryColor: color })} disabled={isLoading} label="Primária" />
                  <ColorPicker value={formData.secondaryColor} onChange={(color) => setFormData({ ...formData, secondaryColor: color })} disabled={isLoading} label="Secundária" />
                  <ColorPicker value={formData.tertiaryColor} onChange={(color) => setFormData({ ...formData, tertiaryColor: color })} disabled={isLoading} label="Terciária" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
