import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPackageTrip, updatePackageTrip, deletePackageTrip } from "@/services/packageTrips";
import { toast } from "sonner";

export const useCreatePackageTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackageTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packageTrips"] });
      toast.success("Viagem criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar viagem");
    },
  });
};

export const useUpdatePackageTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePackageTrip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packageTrips"] });
      toast.success("Viagem atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar viagem");
    },
  });
};

export const useDeletePackageTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackageTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packageTrips"] });
      toast.success("Viagem removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover viagem");
    },
  });
};
