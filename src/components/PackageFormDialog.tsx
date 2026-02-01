import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePackageMutation, useUpdatePackageMutation } from "@/hooks/usePackagesMutations";
import { useHotelsByCompanyQuery } from "@/hooks/useHotelsQuery";
import { useAuth } from "@/hooks/useAuth";
import type { Package } from "@/types/package";

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData?: Package;
}

export const PackageFormDialog = ({ open, onOpenChange, packageData }: PackageFormDialogProps) => {
  const { user } = useAuth();
  const { data: hotelsData } = useHotelsByCompanyQuery(user?.companyId || "");
  const createMutation = useCreatePackageMutation();
  const updateMutation = useUpdatePackageMutation();
  const [selectedHotelId, setSelectedHotelId] = useState(packageData?.hotelId || "");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: packageData?.name || "",
      description: packageData?.description || "",
      nights: packageData?.nights || 1,
      includesBreakfast: packageData?.includesBreakfast || false,
      includesLunch: packageData?.includesLunch || false,
      includesDinner: packageData?.includesDinner || false,
      includesTours: packageData?.includesTours || false,
      openFood: packageData?.openFood || false,
      includesFood: packageData?.includesFood || false,
      includesTransfer: packageData?.includesTransfer || false,
      includesInsurance: packageData?.includesInsurance || false,
    },
  });

  useEffect(() => {
    if (packageData && open) {
      setSelectedHotelId(packageData.hotelId);
      setValue("name", packageData.name);
      setValue("description", packageData.description || "");
      setValue("nights", packageData.nights);
      setValue("includesBreakfast", packageData.includesBreakfast);
      setValue("includesLunch", packageData.includesLunch);
      setValue("includesDinner", packageData.includesDinner);
      setValue("includesTours", packageData.includesTours);
      setValue("openFood", packageData.openFood);
      setValue("includesFood", packageData.includesFood);
      setValue("includesTransfer", packageData.includesTransfer);
      setValue("includesInsurance", packageData.includesInsurance);
    } else if (open) {
      reset();
      setSelectedHotelId("");
    }
  }, [packageData, open, setValue, reset]);

  const onSubmit = async (data: any) => {
    if (!user?.companyId || !selectedHotelId) return;

    const payload = {
      name: data.name,
      description: data.description,
      hotelId: selectedHotelId,
      nights: parseInt(data.nights, 10),
      includesBreakfast: data.includesBreakfast === true,
      includesLunch: data.includesLunch === true,
      includesDinner: data.includesDinner === true,
      includesTours: data.includesTours === true,
      openFood: data.openFood === true,
      includesFood: data.includesFood === true,
      includesTransfer: data.includesTransfer === true,
      includesInsurance: data.includesInsurance === true,
    };

    if (packageData?.id) {
      await updateMutation.mutateAsync({
        id: packageData.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync({
        ...payload,
        companyId: user.companyId,
      });
    }

    reset();
    setSelectedHotelId("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setSelectedHotelId("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{packageData ? "Editar Pacote" : "Novo Pacote"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Pacote</Label>
            <Input id="name" placeholder="Ex: Semana em Caldas Novas" {...register("name", { required: "Nome é obrigatório" })} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Pacote completo com hotel 4 estrelas" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel</Label>
            <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotelsData?.data?.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nights">Número de Noites</Label>
            <Input id="nights" type="number" min="1" placeholder="3" {...register("nights", { required: "Noites é obrigatório" })} />
            {errors.nights && <p className="text-sm text-red-500">{errors.nights.message}</p>}
          </div>

          <div className="border-t pt-4">
            <Label className="text-base font-semibold mb-3 block">Serviços e Inclusões</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Controller name="includesBreakfast" control={control} render={({ field }) => <Checkbox id="includesBreakfast" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesBreakfast" className="font-normal cursor-pointer">
                  ☕ Café da manhã
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller name="includesLunch" control={control} render={({ field }) => <Checkbox id="includesLunch" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesLunch" className="font-normal cursor-pointer">
                  🍽️ Almoço
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller name="includesDinner" control={control} render={({ field }) => <Checkbox id="includesDinner" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesDinner" className="font-normal cursor-pointer">
                  🍷 Jantar
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller name="includesTours" control={control} render={({ field }) => <Checkbox id="includesTours" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesTours" className="font-normal cursor-pointer">
                  🗺️ Passeios
                </Label>
              </div>

              {/* <div className="flex items-center space-x-2">
                <Controller name="includesFood" control={control} render={({ field }) => <Checkbox id="includesFood" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesFood" className="font-normal cursor-pointer">
                  Alimentação
                </Label>
              </div> */}

              <div className="flex items-center space-x-2">
                <Controller name="openFood" control={control} render={({ field }) => <Checkbox id="openFood" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="openFood" className="font-normal cursor-pointer">
                  🍴 All Inclusive
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller name="includesTransfer" control={control} render={({ field }) => <Checkbox id="includesTransfer" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesTransfer" className="font-normal cursor-pointer">
                  🚐 Transfer / Translado
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller name="includesInsurance" control={control} render={({ field }) => <Checkbox id="includesInsurance" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="includesInsurance" className="font-normal cursor-pointer">
                  🛡️ Seguro
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {packageData ? "Atualizar" : "Criar"} Pacote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
