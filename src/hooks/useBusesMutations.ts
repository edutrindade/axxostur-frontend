import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBus, updateBus, deleteBus } from "@/services/buses";
import { toast } from "sonner";

export const useCreateBusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Ônibus criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar ônibus");
    },
  });
};

export const useUpdateBusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Ônibus atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar ônibus");
    },
  });
};

export const useDeleteBusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Ônibus removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover ônibus");
    },
  });
};
