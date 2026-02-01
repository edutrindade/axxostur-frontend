import { api } from "./api";
import type { Package, CreatePackageFormData, UpdatePackageFormData } from "@/types/package";

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PackagesListResponse {
  data: Package[];
  pagination: PaginationData;
}

export type CreatePackageRequest = CreatePackageFormData;
export type UpdatePackageRequest = UpdatePackageFormData;

export const getPackages = async (page: number = 1, limit: number = 20, search?: string): Promise<PackagesListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

  const response = await api.get<PackagesListResponse>(`/packages?${queryString}`);
  return response.data;
};

export const getPackagesByCompany = async (companyId: string, page: number = 1, limit: number = 20, search?: string): Promise<PackagesListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

  const response = await api.get<PackagesListResponse>(`/packages/company/${companyId}?${queryString}`);
  return response.data;
};

export const createPackage = async (data: CreatePackageRequest): Promise<Package> => {
  const response = await api.post<Package>("/packages", data);
  return response.data;
};

export const updatePackage = async (id: string, data: UpdatePackageRequest): Promise<Package> => {
  const response = await api.patch<Package>(`/packages/${id}`, data);
  return response.data;
};

export const deletePackage = async (id: string): Promise<void> => {
  await api.delete(`/packages/${id}`);
};
