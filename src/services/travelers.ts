import { api } from "./api";
import type { Traveler, CreateTravelerRequest, UpdateTravelerRequest, TravelersListResponse } from "@/types/traveler";

export const createTraveler = async (data: CreateTravelerRequest): Promise<Traveler> => {
  const response = await api.post<Traveler>("/travelers", data);
  return response.data;
};

export const getTravelerByCode = async (code: string, companyId: string): Promise<Traveler> => {
  const response = await api.get<Traveler>(`/travelers/company/${companyId}/code/${code}`);
  return response.data;
};

export const getTravelersByCompany = async (companyId: string): Promise<TravelersListResponse> => {
  const response = await api.get<TravelersListResponse>(`/travelers/company/${companyId}`);
  return response.data;
};

export const updateTraveler = async (id: string, data: UpdateTravelerRequest): Promise<Traveler> => {
  const response = await api.patch<Traveler>(`/travelers/${id}`, data);
  return response.data;
};
