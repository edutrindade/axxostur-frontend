import { api } from "./api";
import type { Sale, CreateSaleRequest, UpdateSaleRequest, SaleTraveler, CreateSaleTravelerRequest, SalesListResponse } from "@/types/sale";

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await api.post<Sale>("/sales", data);
  return response.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
  const response = await api.get<Sale>(`/sales/${id}`);
  return response.data;
};

export const updateSale = async (id: string, data: UpdateSaleRequest): Promise<Sale> => {
  const response = await api.patch<Sale>(`/sales/${id}`, data);
  return response.data;
};

export const getSalesByCompany = async (companyId: string, page: number = 1, limit: number = 20): Promise<SalesListResponse> => {
  const response = await api.get<SalesListResponse>("/sales", {
    params: {
      companyId,
      page,
      limit,
    },
  });
  return response.data;
};

export const createSaleTraveler = async (data: CreateSaleTravelerRequest): Promise<SaleTraveler> => {
  const response = await api.post<SaleTraveler>("/sale-travelers", data);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await api.delete(`/sales/${id}`);
};
