import { api } from "./api";
import type { Bus, CreateBusFormData, UpdateBusFormData } from "@/types/bus";

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BusesListResponse {
  data: Bus[];
  pagination: PaginationData;
}

export type CreateBusRequest = CreateBusFormData;
export type UpdateBusRequest = UpdateBusFormData;

export const getBusesByCompany = async (companyId: string, page: number = 1, limit: number = 20, search?: string): Promise<BusesListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

  const response = await api.get<BusesListResponse>(`/buses/company/${companyId}?${queryString}`);
  return response.data;
};

export const createBus = async (data: CreateBusRequest): Promise<Bus> => {
  const response = await api.post<Bus>("/buses", data);
  return response.data;
};

export const updateBus = async (id: string, data: UpdateBusRequest): Promise<Bus> => {
  const response = await api.patch<Bus>(`/buses/${id}`, data);
  return response.data;
};

export const deleteBus = async (id: string): Promise<void> => {
  await api.delete(`/buses/${id}`);
};
