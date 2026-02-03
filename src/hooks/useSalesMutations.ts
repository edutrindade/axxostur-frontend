import { useMutation, useQuery } from "@tanstack/react-query";
import { createSale, updateSale, getSaleById, createSaleTraveler, deleteSale } from "@/services/sales";
import type { CreateSaleRequest, UpdateSaleRequest, CreateSaleTravelerRequest } from "@/types/sale";

export const useCreateSaleMutation = () => {
  return useMutation({
    mutationFn: (data: CreateSaleRequest) => createSale(data),
  });
};

export const useUpdateSaleMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleRequest }) => updateSale(id, data),
  });
};

export const useGetSaleQuery = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: () => getSaleById(id),
    enabled,
  });
};

export const useCreateSaleTravelerMutation = () => {
  return useMutation({
    mutationFn: (data: CreateSaleTravelerRequest) => createSaleTraveler(data),
  });
};

export const useDeleteSaleMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteSale(id),
  });
};
