import { useState } from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Bus, CreateBusFormData, UpdateBusFormData } from "@/types/bus";

const formatPlate = (value: string): string => {
  const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (cleanValue.length > 7) return cleanValue.slice(0, 7);
  const match = cleanValue.match(/^([A-Z]{0,3})(\d{0,4})$/);
  if (match) {
    const letters = match[1] || "";
    const numbers = match[2] || "";
    if (letters.length === 3 && numbers.length > 0) {
      return `${letters} ${numbers}`;
    }
    return letters + numbers;
  }
  return cleanValue;
};

interface BusFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBusFormData | UpdateBusFormData) => Promise<void>;
  isLoading: boolean;
  bus?: Bus;
  title: string;
  description: string;
  companyId: string;
}

export const BusFormDialog = ({ open, onOpenChange, onSubmit, isLoading, bus, title, description, companyId }: BusFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<CreateBusFormData | UpdateBusFormData>({
    defaultValues: {
      name: "",
      plate: "",
      totalSeats: 45,
      type: "conventional",
      companyId,
    },
  });

  useEffect(() => {
    if (open && bus) {
      setValue("name", bus.name);
      setValue("plate", bus.plate);
      setValue("totalSeats", bus.totalSeats);
      setValue("type", bus.type);
    } else if (open && !bus) {
      reset();
    }
  }, [open, bus, setValue, reset]);

  const handlePlateChange = (value: string) => {
    const formatted = formatPlate(value);
    setValue("plate", formatted);
  };

  const handleFormSubmit = async (data: CreateBusFormData | UpdateBusFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(bus ? data : { ...data, companyId });
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
              Nome do Ônibus
            </Label>
            <Controller name="name" control={control} rules={{ required: "Nome é obrigatório" }} render={({ field }) => <Input id="name" placeholder="Marcopolo Andare" {...field} disabled={isSubmitting || isLoading} className="border-slate-200" />} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plate" className="text-slate-700">
              Placa
            </Label>
            <Controller
              name="plate"
              control={control}
              rules={{ required: "Placa é obrigatória" }}
              render={({ field }) => <Input id="plate" placeholder="ABC 1234" value={field.value} onChange={(e) => handlePlateChange(e.target.value)} onBlur={field.onBlur} disabled={isSubmitting || isLoading} className="border-slate-200 uppercase tracking-wider" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSeats" className="text-slate-700">
              Total de Assentos
            </Label>
            <Controller
              name="totalSeats"
              control={control}
              rules={{ required: "Total de assentos é obrigatório" }}
              render={({ field }) => (
                <Input
                  id="totalSeats"
                  type="text"
                  inputMode="numeric"
                  placeholder="45"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value ? Number(value) : "");
                  }}
                  disabled={isSubmitting || isLoading}
                  className="border-slate-200"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-700">
              Tipo de Ônibus
            </Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Tipo é obrigatório" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting || isLoading}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Convencional</SelectItem>
                    <SelectItem value="semi_bed">Semi-Leito</SelectItem>
                    <SelectItem value="bed">Leito</SelectItem>
                    <SelectItem value="bed_cabin">Leito Cabine</SelectItem>
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
