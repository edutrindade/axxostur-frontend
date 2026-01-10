import { api } from "./api";

export interface Company {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
}

export interface UpdateCompanyRequest {
  tradeName?: string;
  email?: string;
  phone?: string;
}

export const listCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>("/companies");
  return response.data;
};

export const getCompany = async (id: string): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
};

export const createCompany = async (data: CreateCompanyRequest): Promise<Company> => {
  const response = await api.post<Company>("/companies", data);
  return response.data;
};

export const updateCompany = async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
  const response = await api.patch<Company>(`/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id: string): Promise<void> => {
  await api.delete(`/companies/${id}`);
};
