import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPackage, updatePackage, deletePackage } from "@/services/packages";
import { toast } from "sonner";

export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Pacote criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar pacote");
    },
  });
};

export const useUpdatePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Pacote atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar pacote");
    },
  });
};

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Pacote removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover pacote");
    },
  });
};
