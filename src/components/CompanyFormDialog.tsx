import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/services/companies";
import { formatCnpj, formatPhone, cleanCnpj, cleanPhone } from "@/utils/format";

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
    tradeName: "",
    cnpj: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        tradeName: company.tradeName || "",
        cnpj: formatCnpj(company.cnpj) || "",
        email: company.email || "",
        phone: formatPhone(company.phone) || "",
      });
    } else {
      setFormData({
        name: "",
        tradeName: "",
        cnpj: "",
        email: "",
        phone: "",
      });
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (company) {
      const updateData: UpdateCompanyRequest = {};
      if (formData.tradeName !== company.tradeName) updateData.tradeName = formData.tradeName;
      if (cleanPhone(formData.phone) !== company.phone) updateData.phone = cleanPhone(formData.phone);
      if (formData.email !== company.email) updateData.email = formData.email;
      onSubmit(updateData);
    } else {
      const createData: CreateCompanyRequest = {
        name: formData.name,
        tradeName: formData.tradeName,
        cnpj: cleanCnpj(formData.cnpj),
        email: formData.email,
        phone: cleanPhone(formData.phone),
      };
      onSubmit(createData);
    }

    setFormData({
      name: "",
      tradeName: "",
      cnpj: "",
      email: "",
      phone: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!company && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome da Empresa</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Razão social" required disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">CNPJ</label>
                <Input value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })} placeholder="XX.XXX.XXX/XXXX-XX" required disabled={isLoading} maxLength={18} />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome Fantasia</label>
            <Input value={formData.tradeName} onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })} placeholder="Nome comercial" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="empresa@exemplo.com" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Telefone</label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(XX) 9 XXXX-XXXX" required disabled={isLoading} maxLength={14} />
          </div>

          <div className="flex gap-3 justify-end pt-4">
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
