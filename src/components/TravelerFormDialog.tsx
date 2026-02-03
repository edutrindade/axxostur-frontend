import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { formatCpf, formatPhone } from "@/utils/format";

interface TravelerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    name: string;
    cpf: string;
    document: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    notes: string;
  };
  onFormChange: (field: keyof TravelerFormDialogProps["form"], value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  error?: string;
  isLoading?: boolean;
}

export const TravelerFormDialog = ({ open, onOpenChange, form, onFormChange, onSubmit, onReset, error, isLoading = false }: TravelerFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar viajante</DialogTitle>
          <DialogDescription>Preencha os dados para cadastrar um novo viajante.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:border-r md:pr-6">
              <h3 className="text-base font-semibold text-slate-900">Informações Pessoais</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">
                  Nome <span className="text-red-500">*</span>
                </label>
                <Input id="create-traveler-name" value={form.name} onChange={(e) => onFormChange("name", e.target.value)} placeholder="Ex: João Santos" />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">CPF</label>
                <Input id="create-traveler-cpf" value={form.cpf} onChange={(e) => onFormChange("cpf", formatCpf(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">RG</label>
                <Input id="create-traveler-document" value={form.document} onChange={(e) => onFormChange("document", e.target.value)} placeholder="Ex: MG123456789" />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Data de Nascimento</label>
                <Input id="create-traveler-birth" type="date" value={form.birthDate} onChange={(e) => onFormChange("birthDate", e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Gênero</label>
                <Select value={form.gender} onValueChange={(value) => onFormChange("gender", value)}>
                  <SelectTrigger id="create-traveler-gender">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Contato</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Email</label>
                <Input id="create-traveler-email" type="email" value={form.email} onChange={(e) => onFormChange("email", e.target.value)} placeholder="joao.santos@email.com" />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Telefone</label>
                <Input id="create-traveler-phone" value={form.phone} onChange={(e) => onFormChange("phone", formatPhone(e.target.value))} placeholder="(85) 3366-1234" maxLength={15} />
              </div>
            </div>
          </div>

          <div className="border-t" />

          <div className="space-y-2">
            <label className="text-base font-medium text-slate-700">Observações</label>
            <Input id="create-traveler-notes" value={form.notes} onChange={(e) => onFormChange("notes", e.target.value)} placeholder="Observações sobre o viajante" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onReset} disabled={isLoading}>
            Limpar
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
