import { api } from "./api";

export interface Hotel {
  id: string;
  name: string;
  companyId: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
  active: boolean;
  address?: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HotelsListResponse {
  data: Hotel[];
  pagination: PaginationData;
}

export interface CreateHotelRequest {
  name: string;
  companyId: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
  active?: boolean;
}

export interface UpdateHotelRequest {
  name?: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
  active?: boolean;
}

export const listHotels = async (page: number = 1, limit: number = 20): Promise<HotelsListResponse> => {
  const response = await api.get<HotelsListResponse>("/hotels", {
    params: { page, limit },
  });
  return response.data;
};

export const listHotelsByCompany = async (companyId: string, page: number = 1, limit: number = 20, name?: string): Promise<HotelsListResponse> => {
  const response = await api.get<HotelsListResponse>(`/hotels/company/${companyId}`, {
    params: { page, limit, ...(name && { name }) },
  });
  return response.data;
};

export const getHotel = async (id: string): Promise<Hotel> => {
  const response = await api.get<Hotel>(`/hotels/${id}`);
  return response.data;
};

export const createHotel = async (data: CreateHotelRequest): Promise<Hotel> => {
  const response = await api.post<Hotel>("/hotels", data);
  return response.data;
};

export const updateHotel = async (id: string, data: UpdateHotelRequest): Promise<Hotel> => {
  const response = await api.patch<Hotel>(`/hotels/${id}`, data);
  return response.data;
};

export const deleteHotel = async (id: string): Promise<void> => {
  await api.delete(`/hotels/${id}`);
};
