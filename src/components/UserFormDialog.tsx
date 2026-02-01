import { useState } from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { User, CreateUserFormData, UpdateUserFormData } from "@/types/user";

const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length > 11) return cleanValue.slice(0, 11);
  const match = cleanValue.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
  if (match) {
    let result = match[1];
    if (match[2]) result += "." + match[2];
    if (match[3]) result += "." + match[3];
    if (match[4]) result += "-" + match[4];
    return result;
  }
  return cleanValue;
};

const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length > 11) return cleanValue.slice(0, 11);
  const match = cleanValue.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  if (match) {
    let result = "";
    if (match[1]) result = "(" + match[1];
    if (match[2]) result += ") " + match[2];
    if (match[3]) result += "-" + match[3];
    return result;
  }
  return cleanValue;
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>;
  isLoading: boolean;
  user?: User;
  title: string;
  description: string;
  companyId?: string;
  isAdmin?: boolean;
}

export const UserFormDialog = ({ open, onOpenChange, onSubmit, isLoading, user, title, description, companyId, isAdmin }: UserFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<CreateUserFormData | UpdateUserFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      role: "attendant",
      companyId,
    },
  });

  useEffect(() => {
    if (open && user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone ? formatPhone(user.phone) : "");
      setValue("cpf", user.cpf ? formatCPF(user.cpf) : "");
      setValue("role", user.role);
      setValue("companyId", user.companyId || undefined);
    } else if (open && !user) {
      reset();
    }
  }, [open, user, setValue, reset, companyId]);

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setValue("cpf", formatted);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setValue("phone", formatted);
  };

  const handleFormSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(user ? data : { ...data, companyId });
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-slate-600">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">
              Nome
            </Label>
            <Controller name="name" control={control} rules={{ required: "Nome é obrigatório" }} render={({ field }) => <Input id="name" placeholder="Eduardo Augusto" {...field} disabled={isSubmitting || isLoading} className="border-slate-200" />} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <Controller name="email" control={control} rules={{ required: "Email é obrigatório" }} render={({ field }) => <Input id="email" type="email" placeholder="usuario@empresa.com.br" {...field} disabled={isSubmitting || isLoading} className="border-slate-200" />} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">
              Telefone
            </Label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Telefone é obrigatório" }}
              render={({ field }) => <Input id="phone" type="text" inputMode="numeric" placeholder="(11) 98877-6655" value={field.value} onChange={(e) => handlePhoneChange(e.target.value)} onBlur={field.onBlur} disabled={isSubmitting || isLoading} className="border-slate-200" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-slate-700">
              CPF
            </Label>
            <Controller
              name="cpf"
              control={control}
              rules={{ required: "CPF é obrigatório" }}
              render={({ field }) => <Input id="cpf" type="text" inputMode="numeric" placeholder="097.604.776-45" value={field.value} onChange={(e) => handleCPFChange(e.target.value)} onBlur={field.onBlur} disabled={isSubmitting || isLoading} className="border-slate-200" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700">
              Função
            </Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Função é obrigatória" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || isLoading}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {isAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="attendant">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
