import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHotel, updateHotel, deleteHotel } from "@/services/hotels";
import type { CreateHotelRequest, UpdateHotelRequest } from "@/services/hotels";
import { toast } from "sonner";

export const useCreateHotelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHotelRequest) => {
      return await createHotel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao criar hotel");
    },
  });
};

export const useUpdateHotelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHotelRequest }) => {
      return await updateHotel(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar hotel");
    },
  });
};

export const useDeleteHotelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteHotel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover hotel");
    },
  });
};
