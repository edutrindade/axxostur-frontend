import { api } from "./api";
import type { PackageTrip, CreatePackageTripFormData, UpdatePackageTripFormData } from "@/types/packageTrip";

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PackageTripsListResponse {
  data: PackageTrip[];
  pagination: PaginationData;
}

export type CreatePackageTripRequest = CreatePackageTripFormData;
export type UpdatePackageTripRequest = UpdatePackageTripFormData;

export const getPackageTrips = async (page: number = 1, limit: number = 20, search?: string): Promise<PackageTripsListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

  const response = await api.get<PackageTripsListResponse>(`/package-trips?${queryString}`);
  return response.data;
};

export const getPackageTripsByCompany = async (companyId: string, page: number = 1, limit: number = 20, search?: string): Promise<PackageTripsListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  const queryString = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

  const response = await api.get<PackageTripsListResponse>(`/package-trips/company/${companyId}?${queryString}`);
  return response.data;
};

export const getPackageTripByCode = async (code: string, companyId: string): Promise<PackageTrip> => {
  const response = await api.get<PackageTrip>(`/package-trips/company/${companyId}/code/${code}`);
  return response.data;
};

export const createPackageTrip = async (data: CreatePackageTripRequest): Promise<PackageTrip> => {
  const response = await api.post<PackageTrip>("/package-trips", data);
  return response.data;
};

export const updatePackageTrip = async (id: string, data: UpdatePackageTripRequest): Promise<PackageTrip> => {
  const response = await api.patch<PackageTrip>(`/package-trips/${id}`, data);
  return response.data;
};

export const deletePackageTrip = async (id: string): Promise<void> => {
  await api.delete(`/package-trips/${id}`);
};
