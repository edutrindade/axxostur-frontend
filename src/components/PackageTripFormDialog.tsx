import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePackageTripMutation, useUpdatePackageTripMutation } from "@/hooks/usePackageTripsMutations";
import { usePackagesQuery } from "@/hooks/usePackagesQuery";
import { useBusesQuery } from "@/hooks/useBusesQuery";
import { useAuth } from "@/hooks/useAuth";
import type { PackageTrip } from "@/types/packageTrip";

interface PackageTripFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageTripData?: PackageTrip;
}

const formatPriceInput = (value: string) => {
  return value.replace(/\D/g, "");
};

const formatPriceDisplay = (value: string) => {
  const numValue = parseInt(formatPriceInput(value) || "0", 10) / 100;
  return numValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const PackageTripFormDialog = ({ open, onOpenChange, packageTripData }: PackageTripFormDialogProps) => {
  const { user } = useAuth();
  const { data: packagesData } = usePackagesQuery(1, 100);
  const { data: busesData } = useBusesQuery(1, 100);
  const createMutation = useCreatePackageTripMutation();
  const updateMutation = useUpdatePackageTripMutation();
  const [selectedPackageId, setSelectedPackageId] = useState(packageTripData?.packageId || "");
  const [selectedBusId, setSelectedBusId] = useState(packageTripData?.busId || "");
  const [priceDisplay, setPriceDisplay] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departureDate: packageTripData?.departureDate?.split("T")[0] || "",
      returnDate: packageTripData?.returnDate?.split("T")[0] || "",
      price: "",
      reservedSeats: packageTripData?.reservedSeats || 0,
    },
  });

  useEffect(() => {
    if (packageTripData && open) {
      setSelectedPackageId(packageTripData.packageId);
      setSelectedBusId(packageTripData.busId);
      setValue("departureDate", packageTripData.departureDate?.split("T")[0] || "");
      setValue("returnDate", packageTripData.returnDate?.split("T")[0] || "");
      setValue("reservedSeats", packageTripData.reservedSeats || 0);
      const priceValue = typeof packageTripData.price === "string" ? packageTripData.price : packageTripData.price.toString();
      setPriceDisplay(priceValue);
    } else if (open) {
      reset();
      setSelectedPackageId("");
      setSelectedBusId("");
      setPriceDisplay("");
    }
  }, [packageTripData, open, setValue, reset]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPriceDisplay(e.target.value);
    setPriceDisplay(formatted);
  };

  const onSubmit = async (data: any) => {
    if (!user?.companyId || !selectedPackageId || !selectedBusId) return;

    const priceValue = parseFloat(priceDisplay.replace(/\./g, "").replace(/,/, "."));

    const payload = {
      companyId: user.companyId,
      packageId: selectedPackageId,
      busId: selectedBusId,
      departureDate: `${data.departureDate}T08:00:00.000Z`,
      returnDate: `${data.returnDate}T18:00:00.000Z`,
      price: priceValue,
      reservedSeats: parseInt(data.reservedSeats, 10),
    };

    if (packageTripData?.id) {
      await updateMutation.mutateAsync({
        id: packageTripData.id,
        data: {
          busId: payload.busId,
          departureDate: payload.departureDate,
          returnDate: payload.returnDate,
          price: payload.price,
          reservedSeats: payload.reservedSeats,
        },
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    reset();
    setSelectedPackageId("");
    setSelectedBusId("");
    setPriceDisplay("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setSelectedPackageId("");
      setSelectedBusId("");
      setPriceDisplay("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{packageTripData ? "Editar Viagem" : "Nova Viagem"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="package">Pacote</Label>
            <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pacote" />
              </SelectTrigger>
              <SelectContent>
                {packagesData?.data?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.nights} noites)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bus">Ônibus</Label>
            <Select value={selectedBusId} onValueChange={setSelectedBusId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ônibus" />
              </SelectTrigger>
              <SelectContent>
                {busesData?.data?.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id}>
                    {bus.plate} - {bus.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">Data de Partida</Label>
              <Input id="departureDate" type="date" {...register("departureDate", { required: "Data de partida é obrigatória" })} />
              {errors.departureDate && <p className="text-sm text-red-500">{errors.departureDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDate">Data de Retorno</Label>
              <Input id="returnDate" type="date" {...register("returnDate", { required: "Data de retorno é obrigatória" })} />
              {errors.returnDate && <p className="text-sm text-red-500">{errors.returnDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="text" placeholder="0,00" value={priceDisplay} onChange={handlePriceChange} className="text-right" />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservedSeats">Assentos Reservados</Label>
              <Input id="reservedSeats" type="number" min="0" placeholder="0" {...register("reservedSeats")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {packageTripData ? "Atualizar" : "Criar"} Viagem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
