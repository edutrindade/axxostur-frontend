import { api } from "./api";
import type { Address } from "./addresses";

export interface Customer {
  id: string;
  name: string;
  companyId: string;
  addressId?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active: boolean;
  address?: Address;
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

export interface CustomersListResponse {
  data: Customer[];
  pagination: PaginationData;
}

export interface CreateCustomerRequest {
  name: string;
  companyId: string;
  addressId?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active?: boolean;
}

export interface UpdateCustomerRequest {
  name?: string;
  addressId?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active?: boolean;
}

export const listCustomers = async (page: number = 1, limit: number = 20): Promise<CustomersListResponse> => {
  const response = await api.get<CustomersListResponse>("/clients", {
    params: { page, limit },
  });
  return response.data;
};

export const listCustomersByCompany = async (companyId: string, page: number = 1, limit: number = 20, search?: string): Promise<CustomersListResponse> => {
  const response = await api.get<CustomersListResponse>(`/clients`, {
    params: { page, limit, companyId, ...(search && { search }) },
  });
  return response.data;
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/clients/${id}`);
  return response.data;
};

export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  const response = await api.post<Customer>("/clients", data);
  return response.data;
};

export const updateCustomer = async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
  const response = await api.patch<Customer>(`/clients/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}`);
};

export const getCustomerByCode = async (code: string, companyId: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/clients/company/${companyId}/code/${code}`);
  return response.data;
};
